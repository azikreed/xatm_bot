const mongoose = require("mongoose");
const config = require("../config");
const logger = require("../utils/logger");

mongoose.connect(config.mongodbUri).then(() => {
    logger.info("MongoDb connection Established");
}).catch((err) => {
    throw err;
})