import { Context, InputFile } from "grammy";
import { writeFile } from "node:fs/promises";
import { getPending, removePending } from "../services/pendingConversions";
import { conversionQueue } from "../services/queue";
import { canConvert } from "../services/rateLimit";
import { prisma } from "../services/prisma";
import { mainConverter } from "../converters/main";
import { normalizeOutputFiletype } from "../converters/normalizeFiletype";
import { getTempPath, cleanup } from "../utils/file";
import { BOT_TOKEN, MONTHLY_CONVERSION_LIMIT } from "../utils/config";

function getDaysUntilMonthEnd(): number {
  const now = new Date();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return endOfMonth.getDate() - now.getDate();
}

export const convertCallbackHandler = async (ctx: Context) => {
  const data = ctx.callbackQuery?.data;
  if (!data || !data.startsWith("c:") || !ctx.user) return;

  const parts = data.split(":");
  if (parts.length < 3) return;

  const pendingId = parts[1];
  const targetFormat = parts.slice(2).join(":");

  const pending = getPending(pendingId);
  if (!pending) {
    await ctx.answerCallbackQuery();
    await ctx.editMessageText(ctx.translations.conversionExpired, { parse_mode: "HTML" });
    return;
  }

  if (pending.userId !== ctx.user.id) {
    await ctx.answerCallbackQuery();
    return;
  }

  await ctx.answerCallbackQuery();

  const { allowed, remaining } = await canConvert(ctx.user.id);
  if (!allowed) {
    await ctx.editMessageText(
      ctx.translations.rateLimitExceeded(getDaysUntilMonthEnd()),
      { parse_mode: "HTML" }
    );
    removePending(pendingId);
    return;
  }

  const fromExt = pending.sourceExtension;
  const creditsAfter = remaining - 1;
  const limit = MONTHLY_CONVERSION_LIMIT;

  const conversion = await prisma.conversion.create({
    data: {
      userId: ctx.user.id,
      inputFormat: fromExt,
      outputFormat: targetFormat,
      status: "pending",
    },
  });

  removePending(pendingId);

  const progressMessageId = ctx.callbackQuery?.message?.message_id;
  const chatId = pending.chatId;
  const originalMessageId = pending.messageId;

  // Show initial status — either queued or processing
  const queuePos = conversionQueue.pendingCount + 1;
  const queueTotal = conversionQueue.pendingCount + conversionQueue.activeCount + 1;

  if (queuePos > 1) {
    await ctx.editMessageText(
      ctx.translations.queued(targetFormat, creditsAfter, limit, queuePos, queueTotal),
      { parse_mode: "HTML" }
    ).catch(() => {});
  } else {
    await ctx.editMessageText(
      ctx.translations.processing(targetFormat, creditsAfter, limit),
      { parse_mode: "HTML" }
    ).catch(() => {});
  }

  try {
    await conversionQueue.enqueue(async () => {
      // Update message to "processing" when dequeued
      if (queuePos > 1) {
        await ctx.editMessageText(
          ctx.translations.processing(targetFormat, creditsAfter, limit),
          { parse_mode: "HTML" }
        ).catch(() => {});
      }

      await prisma.conversion.update({
        where: { id: conversion.id },
        data: { status: "processing" },
      });

      const file = await ctx.api.getFile(pending.fileId);
      const downloadUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${file.file_path}`;
      const response = await fetch(downloadUrl);
      const buffer = Buffer.from(await response.arrayBuffer());

      const outputExt = normalizeOutputFiletype(targetFormat);
      const baseName = pending.fileName.replace(/\.[^.]+$/, "");
      const outputFileName = `${baseName}.${outputExt}`;

      const inputPath = getTempPath(pending.fileName);
      const outputPath = getTempPath(outputFileName);

      await writeFile(inputPath, buffer);

      try {
        await mainConverter(inputPath, fromExt, targetFormat, outputPath);

        await ctx.api.sendDocument(
          chatId,
          new InputFile(outputPath, outputFileName),
          {
            caption: ctx.translations.conversionDone(fromExt, targetFormat),
            parse_mode: "HTML",
            reply_parameters: { message_id: originalMessageId },
          }
        );

        // Delete the progress message
        if (progressMessageId) {
          await ctx.api.deleteMessage(chatId, progressMessageId).catch(() => {});
        }

        await prisma.conversion.update({
          where: { id: conversion.id },
          data: { status: "completed" },
        });
      } finally {
        cleanup(inputPath, outputPath);
      }
    });
  } catch (error: any) {
    console.error("Conversion failed:", error);

    await prisma.conversion.update({
      where: { id: conversion.id },
      data: {
        status: "failed",
        errorMessage: String(error).slice(0, 500),
      },
    });

    await ctx.editMessageText(ctx.translations.conversionFailed, { parse_mode: "HTML" }).catch(() => {});
  }
};
