import {Markup} from "telegraf";
import {getAllCountryButtons, getAllTasksButtons} from "../database/button.js";
import {cmmnds} from "../config/commands.js";
import {postToAllChannels} from "../schedule/posting.js";


export const setBotCommands = (bot) => {
  bot.start((ctx) => ctx.replyWithHTML(`
    Welcome! \n
    <em>Here what you can do:</em>
    ${cmmnds.map(el => `<pre>${el}</pre>\n`).join('')}
  `));

  bot.command('/create_task', async ctx => {
    try {
      await ctx.replyWithHTML(`<b>Select country:</b>`, Markup.inlineKeyboard([
        ... await getAllCountryButtons(),
      ]))
    } catch (e) {
      console.error(e)
    }
  })

  bot.command('/get_tasks', async ctx => {
    try {
      await ctx.replyWithHTML(`<b>Existing tasks:</b>`, Markup.inlineKeyboard([
        ... await getAllTasksButtons(),
      ]))
    } catch (e) {
      console.error(e)
    }
  })

  bot.command('/btc', async ctx => {
      await postToAllChannels('BTC', ctx);
  })
}
