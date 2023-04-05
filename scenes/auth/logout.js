const { Scenes, Markup } = require("telegraf");

const scene = new Scenes.BaseScene("auth:logout");

scene.enter((ctx) => {
    const text = "❗️ Chindan ham akkauntdan chiqmoqchimisiz?";
    const keyboard = Markup.keyboard([["✅ Ha", "❌ Yo'q"]]).resize();
    console.log(ctx.chat.id);
    ctx.reply(text, keyboard);
});

scene.hears("✅ Ha", (ctx) => {
    ctx.session.user = null;
    ctx.scene.enter("start");
});

scene.hears("❌ Yo'q", (ctx) => ctx.scene.enter("auth:after"));

module.exports = scene;
