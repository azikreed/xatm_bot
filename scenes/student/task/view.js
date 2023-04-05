const { Scenes, Markup } = require("telegraf");
const { Task } = require("../../../database/models");
const config = require("../../../config");
const report = require("./report");

const scene = new Scenes.WizardScene(
    "student:task:view",
    async (ctx) => {
        const user = ctx.session.user;
        const tasks = await Task.find({ student: user._id });
        console.log(tasks);
        if(!tasks.length) {
            ctx.scene.enter("student:task:add")
            return ctx.reply("📝 Sizda hech qanday vazifa yo'q!\n\n Ushbu bo'limda vazifa qo'shishingiz mumkin!");
        }
        const task = tasks[tasks.length - 1];
        ctx.wizard.state._id = task?._id;

        const text = `<b>📝 Sizning vazifangiz</b>\n\n🔢 Tartib raqam: ${task.number}\n<b>✏️ Tavsifi:</b> <i>${task.description}</i>\n📊 Holati: ${task.status == "assigned" ? "❌" : task.status == "completed" ? "✅" : "⚠️"}`;
        ctx.replyWithHTML(text);

        const update = `👇 Holatni o'zgartirishni istasangiz quyidagilardan birini tanlang:`
        const keyboard = Markup.keyboard([["✅ Ha", "❌ Yo'q", "⚠️ Chala"], ["➕ Vazifa qo'shish", "◀️ Orqaga"]]).resize();
        ctx.reply(update, keyboard);
        ctx.wizard.next();
    },
    async (ctx) => {
        const status = ctx.message?.text;
        const taskId = ctx.wizard.state._id;
        const user = ctx.session.user;
        const text = `✅ Holat muvaffaqiyatli o'zgartirildi!`;
        let task;
        switch (status) {
            case "◀️ Orqaga":
                return ctx.scene.enter("auth:after");
            case "➕ Vazifa qo'shish":
                return ctx.scene.enter("student:task:add")
            case "✅ Ha":
                task = await Task.findOneAndUpdate({ _id: taskId }, { status: "completed" });
                ctx.reply(text);
                ctx.scene.enter("auth:after");
                break;
            case "❌ Yo'q":
                task = await Task.findOneAndUpdate({ _id: taskId }, { status: "assigned" });
                ctx.reply(text);
                ctx.scene.enter("auth:after");
                break;
            case "⚠️ Chala":
                task = await Task.findOneAndUpdate({ _id: taskId }, { status: "incomplete" });
                ctx.reply(text);
                ctx.scene.enter("auth:after");
                break;
        }
        report(user, task, ctx, "group");
    }


)

module.exports = scene;