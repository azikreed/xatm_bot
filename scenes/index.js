const { Scenes } = require("telegraf");

const stage = new Scenes.Stage([
    require("./start"),
    require("./afterlogin"),
    // require("./add"),
    ...require("./teacher"),
    ...require("./auth"),   
    ...require("./moderator"),
    ...require("./student")
]);

module.exports = stage;
