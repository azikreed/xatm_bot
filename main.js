const config = require("./config");
const bot = require("./core/bot");
const session = require("./core/session");
const auth = require("./middleware/auth");
const stage = require("./scenes");
const logger = require("./utils/logger");
const cron = require("node-cron");
const report = require("./scenes/student/task/report");
const { Task } = require("./database/models");
require("dotenv").config();

require("./database");

bot.use(session);
bot.use(stage.middleware());

bot.start((ctx) => ctx.scene.enter("start"));

const updateData = async () => {
  let cursor = Task.find().cursor();

  let allTasks = [];

  for (let task = await cursor.next(); task != null; task = await cursor.next()) {
    allTasks.push(task);
  }

  allTasks.map(async (item) => {
    await Task.findOneAndUpdate({ number: item.number }, { pora: item.pora == 30 ? 1 : item.pora + 1, status: "assigned" }, { new: true });
  })
}

const getData = async () => {
  let cursor = Task.find().cursor();

  let allTasks = [];

  for (let task = await cursor.next(); task != null; task = await cursor.next()) {
    allTasks.push(task);
  }

  console.log(allTasks);

  report(allTasks, bot);
}

cron.schedule("0 9 * * *", getData);
cron.schedule("0 14 * * *", getData);
cron.schedule("0 20 * * *", getData);
cron.schedule("0 0 * * *", updateData);
cron.schedule("30 0 0 * * *", getData);

bot.catch((err, ctx) => {
  logger.error(`Bot error: ${err.message}`, { error: err });
  if (!config.isProduction) {
    console.log(err);
  }
  ctx.reply("⚠️ Noma'lum xatolik yuz berdi. Noqulaylik uchun uzr so'raymiz");
  ctx.scene.enter("start");
});
