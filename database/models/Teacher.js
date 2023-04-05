const mongoose = require("mongoose");

const Teacher = mongoose.model(
    "Teacher",
    new mongoose.Schema({
        telegramId: {
            type: String,
            required: true
        },
        fullname: {
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
        },
    }, {
        timestamps: true
    })
)

module.exports = Teacher;