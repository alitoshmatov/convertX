import { Context, InlineKeyboard } from "grammy";
import { getSmartTargets } from "../converters/main";
import { getExtension } from "../utils/file";
import { canConvert } from "../services/rateLimit";
import { addPending, getPending } from "../services/pendingConversions";
import { TELEGRAM_DOWNLOAD_LIMIT } from "../utils/config";

const PAGE_SIZE = 15;

function getDaysUntilMonthEnd(): number {
  const now = new Date();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return endOfMonth.getDate() - now.getDate();
}

interface FileInfo {
  fileId: string;
  fileName: string;
  fileSize?: number;
}

function extractFileInfo(ctx: Context): FileInfo | null {
  const msg = ctx.message;
  if (!msg) return null;

  if (msg.document) {
    return {
      fileId: msg.document.file_id,
      fileName: msg.document.file_name || "file",
      fileSize: msg.document.file_size,
    };
  }

  if (msg.photo && msg.photo.length > 0) {
    const largest = msg.photo[msg.photo.length - 1];
    return {
      fileId: largest.file_id,
      fileName: "photo.jpg",
      fileSize: largest.file_size,
    };
  }

  if (msg.audio) {
    const ext = msg.audio.mime_type?.split("/")[1] || "mp3";
    return {
      fileId: msg.audio.file_id,
      fileName: msg.audio.file_name || `audio.${ext}`,
      fileSize: msg.audio.file_size,
    };
  }

  if (msg.video) {
    const ext = msg.video.mime_type?.split("/")[1] || "mp4";
    return {
      fileId: msg.video.file_id,
      fileName: msg.video.file_name || `video.${ext}`,
      fileSize: msg.video.file_size,
    };
  }

  if (msg.voice) {
    return {
      fileId: msg.voice.file_id,
      fileName: "voice.ogg",
      fileSize: msg.voice.file_size,
    };
  }

  if (msg.video_note) {
    return {
      fileId: msg.video_note.file_id,
      fileName: "video_note.mp4",
      fileSize: msg.video_note.file_size,
    };
  }

  if (msg.sticker) {
    const ext = msg.sticker.is_animated ? "tgs" : msg.sticker.is_video ? "webm" : "webp";
    return {
      fileId: msg.sticker.file_id,
      fileName: `sticker.${ext}`,
      fileSize: msg.sticker.file_size,
    };
  }

  return null;
}

export function buildFormatKeyboard(
  pendingId: string,
  targets: string[],
  page: number,
): InlineKeyboard {
  const keyboard = new InlineKeyboard();
  const start = page * PAGE_SIZE;
  const pageTargets = targets.slice(start, start + PAGE_SIZE);

  for (let i = 0; i < pageTargets.length; i++) {
    keyboard.text(pageTargets[i], `c:${pendingId}:${pageTargets[i]}`);
    if ((i + 1) % 4 === 0) keyboard.row();
  }

  // Navigation row
  const hasMore = start + PAGE_SIZE < targets.length;
  const hasPrev = page > 0;

  if (hasPrev || hasMore) {
    keyboard.row();
    if (hasPrev) {
      keyboard.text("◀️", `p:${pendingId}:${page - 1}`);
    }
    if (hasMore) {
      keyboard.text(`More (${targets.length - start - PAGE_SIZE}) ▶️`, `p:${pendingId}:${page + 1}`);
    }
  }

  return keyboard;
}

export const documentHandler = async (ctx: Context) => {
  const fileInfo = extractFileInfo(ctx);
  if (!fileInfo || !ctx.user || !ctx.chat) return;

  if (fileInfo.fileSize && fileInfo.fileSize > TELEGRAM_DOWNLOAD_LIMIT) {
    await ctx.reply(ctx.translations.fileTooLarge, { parse_mode: "HTML" });
    return;
  }

  const extension = getExtension(fileInfo.fileName);
  if (!extension) {
    await ctx.reply(ctx.translations.unsupportedFormat, { parse_mode: "HTML" });
    return;
  }

  const { allowed } = await canConvert(ctx.user.id);
  if (!allowed) {
    const days = getDaysUntilMonthEnd();
    await ctx.reply(ctx.translations.rateLimitExceeded(days), { parse_mode: "HTML" });
    return;
  }

  const targets = getSmartTargets(extension);
  if (targets.length === 0) {
    await ctx.reply(ctx.translations.unsupportedFormat, { parse_mode: "HTML" });
    return;
  }

  const pendingId = addPending({
    fileId: fileInfo.fileId,
    fileName: fileInfo.fileName,
    fileSize: fileInfo.fileSize,
    sourceExtension: extension,
    userId: ctx.user.id,
    chatId: ctx.chat.id,
    messageId: ctx.message!.message_id,
    allTargets: targets,
  });

  const keyboard = buildFormatKeyboard(pendingId, targets, 0);

  await ctx.reply(ctx.translations.selectFormat(extension, targets.length), {
    reply_markup: keyboard,
    parse_mode: "HTML",
  });
};

// Handles pagination callback: "p:<pendingId>:<page>"
export const paginationCallbackHandler = async (ctx: Context) => {
  const data = ctx.callbackQuery?.data;
  if (!data || !data.startsWith("p:") || !ctx.user) return;

  const parts = data.split(":");
  if (parts.length !== 3) return;

  const pendingId = parts[1];
  const page = parseInt(parts[2], 10);

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

  const keyboard = buildFormatKeyboard(pendingId, pending.allTargets, page);
  await ctx.editMessageReplyMarkup({ reply_markup: keyboard }).catch(() => {});
};
