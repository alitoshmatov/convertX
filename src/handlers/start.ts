import { Context, Filter } from "grammy";
import { prisma } from "../services/prisma";
import { notifyOwner } from "../utils/telegram";

export const startHandler = async (ctx: Context) => {
  try {
    if (!ctx.from) return;
    const telegramId = ctx.from.id.toString();
    const referrerId = ctx.match || ""; // ctx.match in command is the payload

    const user = await prisma.user.upsert({
      where: { telegramId },
      create: {
        telegramId,
        firstName: ctx.from.first_name,
        lastName: ctx.from.last_name || "",
        username: ctx.from.username || "",
        // Register referrerId only the first time the user starts the bot
        referrerId: (referrerId as string) || "",
      },
      update: {
        firstName: ctx.from.first_name,
        lastName: ctx.from.last_name || "",
        username: ctx.from.username || "",
      },
    });

    // This check is used to know if user is starting the bot for the first time and notify owner
    if (user.createdAt.getTime() === user.updatedAt.getTime()) {
      notifyOwner(
        ctx,
        `New [user](tg://user?id=${telegramId}) (${telegramId}) @${
          user?.username
        } started the bot referrer ${
          referrerId
            ? `[user](tg://user?id=${referrerId}) [${referrerId}]`
            : "none"
        }`
      );
    }

    // Send welcome message to the user
    await ctx.reply(ctx.translations.welcome(ctx.from.first_name));
  } catch (error: any) {
    notifyOwner(
      ctx,
      `Error starting bot: ${error.message}
      User: ${ctx.from?.first_name} ${ctx.from?.last_name} ${ctx.from?.username} ${ctx.from?.id}`
    );
  }
};
