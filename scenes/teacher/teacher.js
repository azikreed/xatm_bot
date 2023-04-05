const { Scenes, Markup } = require("telegraf");
const { Task } = require("../../database/models");
const config = require("../../config");
const report = require("../student/task/report");

let tasks;

const scene = new Scenes.WizardScene(
    "teacher",
    async (ctx) => {
        const str = `#29_03_2023 
——————————————

1. Xolida opa — 8pora - 142-161bet

2. Zuxra (muallima) — 9pora- 162-181bet 

3. Sayyora opa —10pora- 182-201bet

4. Mashxura —11pora- 202-221bet

5. Feruza —12pora- 222-241bet

6. Abduraxim -13pora- 242-261bet

7. O'giloy —14pora- 262-281bet

8. Javoxir—15pora - 282-301 bet

9. Madina — 16pora - 302-321bet

10. Solixa (kattasi) —17pora-322-341bet

11. Hilola (kattasi) —18pora-342-361bet

12. Zulfizar -19pora-362-381bet

13. Sevinch —20pora-382-401bet

14. Hadicha —21pora-402-421bet 

15. Zuxra —22pora-422-441

16. Oysha —23pora-442-461bet

17. Maftuna —24pora-462-481bet

18. Nilufar —25pora-482-501bet

19. Zebo —26pora-502-521bet

20. Mustofa —27pora-522-541bet

21. Orzuxon —28pora-542-561bet

22. Mohira opa —29pora-562-581bet

23. Barno opa —30pora-582-604bet

24. Lola opa -1pora- 1-21bet

25. Muxabbat opa- 2pora-22-41bet

26. Iqbolaxon —3pora-42-61bet

27. Roziya —4pora-62-81bet

28. Xilola —5pora-82-101bet

29. Umida — 6pora- 102-121bet

30. Vasila — 7pora-122-141bet`
        const text = `📝 Hisobot yuboring.\n\n<b>P.S:</b> <i>👇 Hisobotni aynan quyidagi shaklda jo'natishingiz shart aks holda, muammo yuzaga kelishi mumkin.</i>\n\n<code>${str}</code>`;
        const keyboard = Markup.keyboard(["◀️ Orqaga"]).resize();

        ctx.replyWithHTML(text, keyboard);
        ctx.wizard.next();
    },
    (ctx) => {
        const report = ctx.message?.text;
        const regex = /\n(\d+).\s*(\b[\w]+[']*[\w]*[ ]*[\w\(\)]+[']*[\w\(\)]*)[\s ]*[-—][\s ]*(\d+)pora[\s ]*-[\s ]*(\d+)-(\d+)[\s]?(?:bet)?/gm;

        if(report == "◀️ Orqaga") {
            return ctx.scene.enter("start");
        }

        let m;

        let arr = [];

        while ((m = regex.exec(report)) !== null) {
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            let obj = {};

            obj.number = m[1];
            obj.name = m[2];
            obj.pora = m[3];
            obj.status = "assigned";
            // obj.scale = `${m[4]}-${m[5]}`;
            arr.push(obj);
        }
        tasks = arr;

        const text = `📝 Hisobotni tasdiqlaysizmi?`;
        const keyboard = Markup.keyboard([["✅ Ha", "❌ Yo'q"]]).resize();

        ctx.reply(text, keyboard);
        ctx.wizard.next();
    },
    async (ctx) => {
        const answer = ctx.message?.text;

        if (answer == "❌ Yo'q") {
            return ctx.scene.enter("teacher");
        }
        if (!answer) {
            return ctx.scene.enter("teacher");
        }
        let saved = tasks.map(async (task) => {
            await Task.create(task);
        });
        let text = `✅ Hisobot muvaffaqiyatli saqlandi.`;
        if (!saved) {
            text = `⚠️ Xatolik yuz berdi. To'g'ri ma'lumot yuboring!`;
        }
        report(tasks, ctx);
        ctx.reply(text);
        ctx.scene.enter("start");
    }
)

module.exports = scene;