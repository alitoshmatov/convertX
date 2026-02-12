export const BOT_TOKEN = process.env.BOT_TOKEN;
export const BOT_USERNAME = process.env.BOT_USERNAME;

export const DATABASE_URL = process.env.DATABASE_URL;

export const OWNER_IDS = process.env.OWNER_IDS?.split(",");

export const MAX_CONCURRENT_CONVERSIONS = parseInt(
  process.env.MAX_CONCURRENT_CONVERSIONS || "5"
);
export const MONTHLY_CONVERSION_LIMIT = parseInt(
  process.env.MONTHLY_CONVERSION_LIMIT || "100"
);
export const TEMP_DIR = process.env.TEMP_DIR || "/tmp/convertx";
export const TELEGRAM_DOWNLOAD_LIMIT = 20 * 1024 * 1024; // 20MB
export const TELEGRAM_UPLOAD_LIMIT = 50 * 1024 * 1024; // 50MB
