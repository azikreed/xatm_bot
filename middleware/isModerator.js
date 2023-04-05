module.exports = (ctx, next) => {
    if(ctx.session.user?.isModerator) {
        return next();
    }
    return;
}