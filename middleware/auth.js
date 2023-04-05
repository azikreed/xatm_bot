module.exports = (ctx, next) => {
    const { user } = ctx.session;
    if (!user) {
        ctx.reply("⚠️ Avtorizatsiyadan o'tmagansiz!");
        return ctx.scene.enter("start");
    }

    return next();
};
