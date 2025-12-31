import { Bot } from "grammy";
import { BOT_TOKEN } from "./utils/config";
import { notifyOwner } from "./utils/telegram";
import { auth } from "./middlewares/auth";
import { startHandler } from "./handlers/start";
import { helpHandler } from "./handlers/help";

const bot = new Bot(BOT_TOKEN!);

bot.api.setMyCommands([
  { command: "start", description: "♻️ Restart" },
  {
    command: "help",
    description: "🆘 Help | Yordam",
  },
]);

// Middlewares
bot.use(auth);

// Commands
bot.command("start", startHandler);
bot.command("help", helpHandler);

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
