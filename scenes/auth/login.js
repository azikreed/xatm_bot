const { Scenes, Markup } = require("telegraf");
const { Moderator, Teacher, Student } = require("../../database/models");

const scene = new Scenes.WizardScene("auth:login",
    (ctx) => {
        const text = "✍️ <b>Username</b> ni kiriting";
        const keyboard = Markup.keyboard(["◀️ Orqaga"]).resize();
        ctx.replyWithHTML(text, keyboard);
        ctx.wizard.next();
    },
    (ctx) => {
        const username = ctx.message?.text;
        if (username == "◀️ Orqaga") {
            return ctx.scene.enter("start");
        }
        if (!username) {
            return ctx.reply("❗️ Iltimos, to'g'ri formatdagi username kiriting...");
        }
        ctx.wizard.state.username = username;

        const text = "🛡 Parolni kiriting.";
        ctx.reply(text);
        ctx.wizard.next();
    },
    async (ctx) => {
        const password = ctx.message?.text;
        if (!password) {
            return ctx.reply("❗️ Iltimos, to'g'ri formatdagi parol kiriting!");
        }
        ctx.wizard.state.password = password;

        const moderator = await Moderator.findOne(ctx.wizard.state);
        if (!moderator) {
            const teacher = await Teacher.findOne(ctx.wizard.state);
            if (!teacher) {
                const student = await Student.findOne(ctx.wizard.state);
                if (!student) {
                    ctx.reply("❗️ Berilgan ma'lumotlar noto'g'ri!");
                    return ctx.scene.enter("auth:login");
                }
                student.isStudent = true;
                ctx.session.user = student;
                ctx.replyWithHTML(`✅ Mos akkaunt topildi: <b>${student.fullname}</b>\n🎓 O'quvchi`);
            } else {
                teacher.isTeacher = true;
                ctx.session.user = teacher;
                ctx.replyWithHTML(`✅ Mos akkaunt topildi: <b>${teacher.fullname}</b>\n🎓 O'qituvchi`);
            }
        } else {
            moderator.isModerator = true;
            ctx.session.user = moderator;
        }
        ctx.scene.enter("auth:after");
    }
)

module.exports = scene;