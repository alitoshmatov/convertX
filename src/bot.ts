import { Bot } from "grammy";
import { BOT_TOKEN } from "./utils/config";
import { notifyOwner } from "./utils/telegram";
import { auth } from "./middlewares/auth";
import { startHandler, languageCallbackHandler } from "./handlers/start";
import { helpHandler } from "./handlers/help";
import { documentHandler, paginationCallbackHandler } from "./handlers/document";
import { convertCallbackHandler } from "./handlers/convert";

const bot = new Bot(BOT_TOKEN!);

bot.api.setMyCommands([
  { command: "start", description: "Start & choose language" },
  { command: "help", description: "How to use this bot" },
]);

// Middlewares
bot.use(auth);

// Commands
bot.command("start", startHandler);
bot.command("help", helpHandler);

// File handling — all media types route through the same handler
bot.on("message:document", documentHandler);
bot.on("message:photo", documentHandler);
bot.on("message:audio", documentHandler);
bot.on("message:video", documentHandler);
bot.on("message:voice", documentHandler);
bot.on("message:video_note", documentHandler);
bot.on("message:sticker", documentHandler);

// Callback queries — route by prefix
bot.on("callback_query:data", async (ctx, next) => {
  const data = ctx.callbackQuery.data;
  if (data.startsWith("lang:")) return languageCallbackHandler(ctx);
  if (data.startsWith("p:")) return paginationCallbackHandler(ctx);
  if (data.startsWith("c:")) return convertCallbackHandler(ctx);
  return next();
});

// Plain text messages — explain what the bot does
bot.on("message:text", async (ctx) => {
  await ctx.reply(ctx.translations.textMessage);
});

// Error handling
bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error during update ${ctx.update.update_id}:`, err);
  notifyOwner(
    ctx,
    `Error occurred while handling update from ${ctx.from?.first_name} (ID: ${
      ctx.from?.id
    }):\n${JSON.stringify(err)}`
  );
});

export default bot;
