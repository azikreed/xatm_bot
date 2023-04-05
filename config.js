require("dotenv").config();
const process = require("node:process");

const config = {
  token: process.env.TOKEN,
  isProduction: process.env.NODE_ENV === "production",
  domain: process.env.WEBHOOK_DOMAIN,
  port: process.env.PORT,
  mongodbUri: process.env.MONGODB_URI,
  admin_name: process.env.ADMIN_NAME,
  admin_tg_id: process.env.ADMIN_TELEGRAM_ID,
  admin_username: process.env.ADMIN_USERNAME,
  admin_password: process.env.ADMIN_PASSWORD,
  group_id: process.env.GROUP_ID
};

module.exports = config;
