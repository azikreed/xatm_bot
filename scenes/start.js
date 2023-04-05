const { Scenes, Markup } = require("telegraf");

const scene = new Scenes.BaseScene("start");

scene.enter((ctx) => {
    const text = '👇 Kim bo\'lib kirishni xohlaysiz?';
    const keyboard = Markup.keyboard([
        "🧑‍🏫 O'qituvchi", "🎓 O'quvchi"
    ]).resize();
    ctx.reply(text, keyboard);
});

scene.hears("🧑‍🏫 O'qituvchi", (ctx) => {
    ctx.scene.enter("teacher");
});

scene.hears("🎓 O'quvchi", (ctx) => {
    ctx.scene.enter("student");
});

module.exports = scene;