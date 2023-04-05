const { Scenes, Markup } = require("telegraf");
const { Task } = require("../../../database/models");
const config = require("../../../config");
const report = require("./report");

const scene = new Scenes.WizardScene(
    "student:task:add",
    (ctx) => {
        const text = `🔢 Tartib raqamingizni kiriting:`;
        const keyboard = Markup.keyboard(["◀️ Orqaga"]).resize();
        ctx.replyWithHTML(text, keyboard);
        ctx.wizard.next();
    },
    (ctx) => {
        const number = ctx.message?.text;
        if (!number) {
            return ctx.reply("❗️ Iltimos, to'g'ri ma'lumot kiriting!")
        }
        if (number == "◀️ Orqaga") {
            return ctx.scene.enter("auth:after");
        }
        ctx.wizard.state.number = number;

        const text = `📝 Sizga qanday vazifa berilgan edi?\n\n<b>Masalan:</b> <i>Kitobning 10 betini o'qish</i>`;
        const keyboard = Markup.keyboard(["◀️ Orqaga"]).resize();
        ctx.replyWithHTML(text, keyboard);
        ctx.wizard.next();
    },
    (ctx) => {
        const user = ctx.session.user;
        const description = ctx.message?.text;
        if (!description) {
            return ctx.reply("❗️ Iltimos, to'g'ri ma'lumot kiriting!")
        }
        if (description == "◀️ Orqaga") {
            return ctx.scene.enter("auth:after");
        }
        ctx.wizard.state.description = description;
        ctx.wizard.state.student = user._id;
        ctx.wizard.state.status = "assigned";

        const text = `❔ Sizga berilgan vazifani bajardingizmi?\n\n<b>✅ Ha</b> , <b>❌ Yo'q</b> , <b>⚠️ Chala</b> tugmalardan birini tanlang`;
        const keyboard = Markup.keyboard([["✅ Ha", "❌ Yo'q"], ["⚠️ Chala"]]).resize();
        ctx.replyWithHTML(text, keyboard);
        ctx.wizard.next()
    },
    (ctx) => {
        const status = ctx.message?.text;
        let text;
        const keyboard = Markup.keyboard(["◀️ Orqaga"]).resize();
        if (status === "✅ Ha") {
            ctx.wizard.state.status = "completed";
            text = '👍 Ajoyib! Ishlaringizga rivoj tilab qolamiz. 😊'
        } else if (status == "❌ Yo'q") {
            ctx.wizard.state.status = "assigned";
            text = `👎 Yaxshi emas! Vazifalarni o'z vaqtida bajarmasangiz qolib ketasiz birodar)`
        } else {
            ctx.wizard.state.status = "incomplete";
            text = `🤔 Nima uchun chala?`
        }

        if (status == "◀️ Orqaga") {
            return ctx.scene.enter("auth:after");
        }

        ctx.replyWithHTML(text + `\n\n<i>👇 Izoh yozib qoldiring!</i>`, keyboard);
        ctx.wizard.next();
    },
    async (ctx) => {
        const user = ctx.session.user;
        const comment = ctx.message?.text;
        if (!comment) {
            ctx.reply("❗️ Iltimos, to'g'ri ma'lumot kiriting!");
        }
        ctx.wizard.state.comment = comment;
        const task = await Task.create(ctx.wizard.state);
        ctx.replyWithHTML(`✅ E'tiboringiz uchun rahmat!`);
        // let text = `📝 <b>Hisobot</b>\n\n<b>Kimdan:</b> ${user.fullname}\n<b>Vazifa:</b><i> ${task.description}</i>\n<b>Holati:</b> ${task.status == "assigned" ? "❌" : task.status == "completed" ? "✅" : "⚠️"}`;
        // let allUsers = await Task.find().populate("student");
        // allUsers = allUsers.reduce((acc, current, index) => {
        //     let existingIndex = acc.findIndex(
        //         (item) => (
        //             item.student._id === current.student._id
        //         )
        //     );

        //     if (existingIndex > -1) {
        //         acc[existingIndex].status = current.status;
        //         return acc;
        //     } else {
        //         return [...acc, current];
        //     }
        // }, []);

        // let userListText = allUsers.sort((a, b) => (a.number - b.number)).map((item, index) => `\n<b>${item.number}</b>. ${item.student.fullname} - ${item.status == "completed" ? "✅" : item.status == "assigned" ? "❌" : "⚠️"}`).sort((a, b) => { return a - b }).join("");

        // const date = new Date();
        // const hour = date.getHours().toString().length == 1 ? 0 + date.getHours().toString() : date.getHours().toString();
        // const minute = date.getMinutes().toString().length == 1 ? 0 + date.getMinutes().toString() : date.getMinutes().toString();
        // const userList = `📝 Hisobot\n-------------------------------------------------------\n📅 ${date.toLocaleDateString()} | ${hour}:${minute} holatiga ko'ra\n-------------------------------------------------------${userListText}`;
        // ctx.telegram.sendMessage(config.group_id, text, { parse_mode: "HTML" });
        // ctx.telegram.sendMessage(config.group_id, userList, { parse_mode: "HTML" });
        report(user, task, ctx, "group");
        ctx.scene.enter("auth:after");
    }
)

module.exports = scene;