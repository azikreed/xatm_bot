module.exports = (ctx, next) => {
    if(ctx.session.user?.isStudent) {
        return next();
    }
    return;
}