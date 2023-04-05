const mongoose = require("mongoose");

const Moderator = mongoose.model(
    "Moderator",
    new mongoose.Schema({
        telegramId: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        }
    }, {
        timestamps: true
    })
)

module.exports = Moderator;