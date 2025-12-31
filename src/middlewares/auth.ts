import { Context, NextFunction } from "grammy";

import { prisma } from "../services/prisma";
import {
  getTranslationForSpecificLanguage,
  Language,
} from "../utils/translations";
import { isGroup } from "../utils/telegram";

export const auth = async (ctx: Context, next: NextFunction) => {
  console.log(ctx.message?.text);

  // Defaulting for any cases
  ctx.translations = getTranslationForSpecificLanguage("en");

  // If user is starting the bot we can skip the middleware because user is not yet in the database
  if (ctx.message?.text?.startsWith("/start")) {
    return next();
  }

  if (!isGroup(ctx)) {
    if (!ctx.from) return;

    const user = await prisma.user.findUnique({
      where: { telegramId: ctx.from.id.toString() },
    });
    ctx.user = user;
    ctx.translations = getTranslationForSpecificLanguage(
      user?.language as Language
    );

    if (!user) {
      // If user is not found force them to /start so we can create a record in DB for them
      await ctx.reply(ctx.translations.pleaseStartBot);
      return;
    }
  }

  return next();
};
