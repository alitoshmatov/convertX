import "dotenv/config";

export const BOT_TOKEN = process.env.BOT_TOKEN;
export const BOT_USERNAME = process.env.BOT_USERNAME;

export const DATABASE_URL = process.env.DATABASE_URL;

export const OWNER_IDS = process.env.OWNER_IDS?.split(",");
