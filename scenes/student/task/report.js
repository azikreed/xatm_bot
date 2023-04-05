const { Task } = require("../../../database/models");
const config = require("../../../config");

const report = async (tasks, ctx, chatType) => {
    // let cursor = Task.find().cursor();

    // let allTasks = [];

    // for (let task = await cursor.next(); task != null; task = await cursor.next()) {
    //     allTasks.push(task);
    // }
    // console.log(allTasks.length);

    // allUsers = allUsers.reduce((acc, current) => {
    //     let existingIndex = acc.findIndex(
    //         (item) => (
    //             item.number === current.number
    //         )
    //     );
    //     if (existingIndex > -1) {
    //         acc[existingIndex].status = current.status;
    //         return acc;
    //     } else {
    //         return [...acc, current];
    //     }
    // }, []);



    let userListText = tasks.sort((a, b) => (a.number - b.number)).map((item, index) => `\n<b>${item.number}</b>. ${item.name} -- ${item.pora} pora - ${item.status == "completed" ? "✅" : item.status == "assigned" ? "❌" : "⚠️"}`).join("");
    const date = new Date();
    const hour = date.getHours().toString().length == 1 ? 0 + date.getHours().toString() : date.getHours().toString();
    const minute = date.getMinutes().toString().length == 1 ? 0 + date.getMinutes().toString() : date.getMinutes().toString();
    const userList = `📝 Hisobot\n-------------------------------------------------------\n📅 ${date.toLocaleDateString()} | ${hour}:${minute} holatiga ko'ra\n-------------------------------------------------------${userListText}\n-------------------------------------------------------\n<b>Jami:</b> ${tasks.length} ta o'quvchi`;
    ctx.telegram.sendMessage(config.group_id, "📝 Berilgan vazifani bajarishni unutmang!");
    ctx.telegram.sendMessage(config.group_id, userList, { parse_mode: "HTML" });
}

module.exports = report;