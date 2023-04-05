module.exports = (ctx, next) => {
    if(ctx.session.user?.isTechaer) {
        return next();
    }
    return;
}