const { Scenes, Markup } = require("telegraf");
const { Task } = require("../../database/models");
const config = require("../../config");
const report = require("../student/task/report");

const scene = new Scenes.WizardScene(
    "student",
    (ctx) => {
        const text = `🔢 Tartib raqamingizni kiriting:`;
        const keyboard = Markup.keyboard(["◀️ Orqaga"]).resize();

        ctx.reply(text, keyboard);
        ctx.wizard.next();
    },
    (ctx) => {
        let number = ctx.message?.text;
        if (number == "◀️ Orqaga") {
            return ctx.scene.enter("start");
        }
        if (!number) {
            return ctx.reply("🔢 Faqatgina raqam kiritish mumkin!");
        }

        ctx.wizard.state.number = number;

        let text = `📝 Vazifani bajardingizmi?\n\n👇 Quyidagilardan birini tanlash orqali javob bering.`;
        let keyboard = Markup.keyboard([["✅ Ha", "❌ Yo'q"], ["◀️ Orqaga"]]).resize();
        ctx.reply(text, keyboard);
        ctx.wizard.next();
    },
    async (ctx) => {
        let number = ctx.wizard.state.number;
        let answer = ctx.message?.text;

        if (answer == "❌ Yo'q") {
            return ctx.reply("👎 Vazifalarni o'z vaqtida bajarmaslikni o'zingizga va o'qituvchiga nisbatan odobsizlik deb biling.");
        }
        if(answer == "◀️ Orqaga") {
            return ctx.scene.enter("start");
        }

        const task = await Task.findOneAndUpdate({ number: number }, { status: "completed" }, { new: true });
        let text = `📝 <b>Hisobot</b>\n\n<b>🔢 Tartib raqam:</b> ${task.number}\n<b>📄 Vazifa:</b><i> ${task.pora}</i>\n<b>📊 Holati:</b> ${task.status == "assigned" ? "❌" : "✅"}`;
        ctx.replyWithHTML(text);

        let cursor = Task.find().cursor();

        let allTasks = [];

        for (let task = await cursor.next(); task != null; task = await cursor.next()) {
            allTasks.push(task);
        }

        report(allTasks, ctx);
        ctx.scene.enter("start");
    }
)

module.exports = scene;