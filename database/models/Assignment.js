const mongoose = require("mongoose");

const Assignment = mongoose.model(
    "Assignment",
    new mongoose.Schema({
        taskId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task"
        },
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student"
        },
        teacherId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        status: {
            type: String,
            enum: ["assigned", "due", "completed"],
            required: true
        }
    }, {
        timestamps: true
    })
)

module.exports = Assignment;