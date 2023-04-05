const mongoose = require("mongoose");

const Task = mongoose.model(
    "Task",
    new mongoose.Schema({
        number: {
            type: Number,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        pora: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            default: "assigned",
            enum: ["assigned", "completed"]
        },
    }, {
        timestamps: true,
        minimize: false
    })
)

module.exports = Task;