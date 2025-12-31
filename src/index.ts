import bot from "./bot";
import { notifyOwner } from "./utils/telegram";

bot.start();

console.log("Bot started");

if (process.env.NODE_ENV === "production") {
  notifyOwner(bot, "Bot started in production");
}
