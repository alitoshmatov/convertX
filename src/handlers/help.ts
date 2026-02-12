import { Context } from "grammy";

export const helpHandler = async (ctx: Context) => {
  await ctx.reply(ctx.translations.help, { parse_mode: "HTML" });
};
