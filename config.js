require("dotenv").config();
const process = require("node:process");

const config = {
  token: process.env.TOKEN,
  isProduction: process.env.NODE_ENV === "production",
  domain: process.env.WEBHOOK_DOMAIN,
  port: process.env.PORT,
  mongodbUri: process.env.MONGODB_URI,
  group_id: process.env.GROUP_ID
};

module.exports = config;
