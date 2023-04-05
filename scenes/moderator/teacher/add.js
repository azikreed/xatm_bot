const { Scenes, Markup } = require("telegraf");
const { Teacher } = require("../../../database/models");

const scene = new Scenes.WizardScene("moderator:teacher:add",
    (ctx) => {
        const text = `🧑‍🏫 O'qituvchi uchun <b>F.I.O (familiya, ism, otasining ismi)</b>ni kiriting\n\nMasalan: <b>Abdullayev Ali Alimdjanovich</b>`;
        const keyboard = Markup.keyboard(["◀️ Orqaga"]).resize();
        ctx.replyWithHTML(text, keyboard);
        ctx.wizard.next();
    },
    (ctx) => {
        const fullname = ctx.message?.text;
        if (fullname == "◀️ Orqaga") {
            return ctx.scene.enter("start");
        }
        if (!fullname) {
            return ctx.reply("❗️ Iltimos, to'g'ri formatdagi username kiriting...");
        }

        ctx.wizard.state.fullname = fullname;
        ctx.wizard.state.telegramId = ctx.chat.id;

        let username = "";
        fullname.split(" ").forEach(element => {
            username += element[0];
        });

        const date = new Date();
        ctx.wizard.state.username = `${date.getMinutes()}${date.getHours()}${date.getDate()}${username}`;

        const text = "🛡 Parolni kiriting:";
        ctx.reply(text);
        ctx.wizard.next();
    },
    async (ctx) => {
        const password = ctx.message?.text;
        if (!password) {
            return ctx.reply("❗️ Iltimos, to'g'ri formatdagi parol kiriting!");
        }
        ctx.wizard.state.password = password;

        const teacher = await Teacher.create(ctx.wizard.state);

        ctx.replyWithHTML(`🎉 Tabriklaymiz ushbu o'qituvchi ro'yxatdan o'tkazildi.\n\n Endi ushbu o'qituvchi <b>🚪 Tizimga kirish</b> bo'limi orqali botdan foydalanishingiz mumkin.\n<b>🎓 O'qituvchi</b>\n\n<b>F.I.O:</b> ${teacher.fullname}\n<b>Username:</b> <code>${teacher.username}</code>\n<b>Parol:</b> <code>${teacher.password}</code>`);
        ctx.scene.enter("auth:after");
    }
)

module.exports = scene;