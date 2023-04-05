const { Scenes, Markup } = require("telegraf");
const isModerator = require("../middleware/isModerator");
const isTeacher = require("../middleware/isTeacher");
const isStudent = require("../middleware/isStudent");

const scene = new Scenes.BaseScene("auth:after");

scene.enter((ctx) => {
    const text = "👇 Quyidagilardan birini tanlashingiz mumkin...";
    // const user = ctx.session.user;

    let panelButtons;
    // if (user?.isModerator) {
    //     panelButtons = [
    //         ["🧑‍🏫 O'qituvchi qo'shish", "🧑‍🎓 O'quvchi qo'shish"],
    //         ["📕 Qo'llanma"],
    //     ]
    // } else if (user?.isStudent) {
    //     panelButtons = [
    //         ["📃 Hisobot kiritish", "📝 Mening vazifam"],
    //     ]
    // } else {
    //     panelButtons = [
    //         [["📝 Hisobot olish", "🧑‍🎓 O'quvchilar"], ["🎲 Topshiriq kiritish"]]
    //     ]
    // }
    panelButtons = [
        [["🧑‍🏫 O'qituvchi bo'lib kirish", "🎓 O'quvchi bo'lib kirish"]]
    ]


    const keyboard = Markup.keyboard([
        ...panelButtons,
        // ["🚪 Akkauntdan chiqish"],
    ]).resize();
    ctx.reply(text, keyboard);
});

// scene.hears("🚪 Akkauntdan chiqish", (ctx) => {
//     ctx.scene.enter("auth:logout")
// })

// scene.hears("🧑‍🏫 O'qituvchi qo'shish", isModerator, (ctx) => {
//     ctx.scene.enter("moderator:teacher:add")
// })

// scene.hears("📃 Hisobot kiritish", isStudent, (ctx) => {
//     ctx.scene.enter("student:task:add")
// })

// scene.hears("📝 Hisobot olish", (ctx) => {
//     ctx.scene.enter("teacher:task:view")
// })

// scene.hears("📝 Mening vazifam", isStudent, (ctx) => {
//     ctx.scene.enter("student:task:view")
// })

// scene.hears("🎲 Topshiriq kiritish", (ctx) => {
//     ctx.scene.enter("teacher:task:add")
// })

module.exports = scene;