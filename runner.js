const config = require("./config");
const bot = require("./core/bot");
const app = require("./core/server");
const logger = require("./utils/logger");

require("./main");

if (config.isProduction) {
  // webhook
  (async () => {
    app.use(await bot.createWebhook({ domain: config.domain }));
    app.listen(config.port, () =>
      logger.info(`Production server started on port ${config.port}`)
    );
  })();
} else {
  logger.info("Development mode is ON");
  // long polling
  app.listen(config.port, () => {
    logger.info(`Development server started on port ${config.port}`);
  });
  bot.launch().then(() => {
    logger.info(`Telegram bot with username @${bot.botInfo.username} started!`);
  });
}
