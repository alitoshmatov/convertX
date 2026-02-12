import { Context, InlineKeyboard } from "grammy";
import { prisma } from "../services/prisma";
import { notifyOwner } from "../utils/telegram";
import {
  getTranslationForSpecificLanguage,
  Language,
} from "../utils/translations";

const LANGUAGES: { code: Language; label: string }[] = [
  { code: "en", label: "🇬🇧 English" },
  { code: "ru", label: "🇷🇺 Русский" },
  { code: "uz", label: "🇺🇿 O'zbekcha" },
  { code: "uz_cyrillic", label: "🇺🇿 Ўзбекча" },
];

export const startHandler = async (ctx: Context) => {
  try {
    if (!ctx.from) return;
    const telegramId = ctx.from.id.toString();
    const referrerId = ctx.match || "";

    const user = await prisma.user.upsert({
      where: { telegramId },
      create: {
        telegramId,
        firstName: ctx.from.first_name,
        lastName: ctx.from.last_name || "",
        username: ctx.from.username || "",
        referrerId: (referrerId as string) || "",
      },
      update: {
        firstName: ctx.from.first_name,
        lastName: ctx.from.last_name || "",
        username: ctx.from.username || "",
      },
    });

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

    // Show language selection
    const keyboard = new InlineKeyboard();
    for (const lang of LANGUAGES) {
      keyboard.text(lang.label, `lang:${lang.code}`).row();
    }

    const t = getTranslationForSpecificLanguage(user.language as Language);
    await ctx.reply(t.chooseLanguage, { reply_markup: keyboard });
  } catch (error: any) {
    notifyOwner(
      ctx,
      `Error starting bot: ${error.message}
      User: ${ctx.from?.first_name} ${ctx.from?.last_name} ${ctx.from?.username} ${ctx.from?.id}`
    );
  }
};

export const languageCallbackHandler = async (ctx: Context) => {
  const data = ctx.callbackQuery?.data;
  if (!data || !data.startsWith("lang:") || !ctx.from) return;

  const langCode = data.replace("lang:", "") as Language;
  const validCodes: Language[] = ["en", "ru", "uz", "uz_cyrillic"];
  if (!validCodes.includes(langCode)) return;

  await ctx.answerCallbackQuery();

  const telegramId = ctx.from.id.toString();

  await prisma.user.update({
    where: { telegramId },
    data: { language: langCode },
  });

  // Update translations for this context
  const t = getTranslationForSpecificLanguage(langCode);
  ctx.translations = t;

  await ctx.editMessageText(t.languageSet);

  // Send welcome with new language
  await ctx.reply(t.welcome(ctx.from.first_name), { parse_mode: "HTML" });
};
