import {Markup} from "telegraf";
import {getAllCountryButtons, getAllTasksButtons} from "../database/button.js";
import {getCoinPrice} from "../ticker/index.js";
import {getFormatedMessage} from "../util/index.js";

export const setBotCommands = (bot) => {
  bot.command('/create_task', async ctx => {
    try {
      await ctx.replyWithHTML(`<b>Select country:</b>`, Markup.inlineKeyboard([
        ...getAllCountryButtons(),
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
      const data = await getCoinPrice('BTC')
      const answer = await getFormatedMessage('BTC', data);
      ctx.reply(answer)
  })
}
