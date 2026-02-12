import { Api, Bot, Context, RawApi } from "grammy";
import { OWNER_IDS } from "./config";

export const isGroup = (ctx: Context) => {
  return ctx.chat?.type === "group" || ctx.chat?.type === "supergroup";
};

export const notifyOwner = (
  bot: Bot<Context, Api<RawApi>> | Context,
  message: string
) => {
  OWNER_IDS?.forEach((ownerId) => {
    bot.api
      .sendMessage(ownerId, message)
      .catch((e) => {
        console.error(`Error sending message to owner ${ownerId}:`, e);
      });
  });
};
