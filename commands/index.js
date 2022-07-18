import {Markup} from "telegraf";
import {getAllCountryButtons, getAllTasksButtons} from "../database/button.js";
import fetch from 'node-fetch';

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
        ...getAllTasksButtons(),
      ]))
    } catch (e) {
      console.error(e)
    }
  })

  bot.command('/btc', async ctx => {
      const resp = await fetch(`${process.env.TICKER_URL}/BTC/`)
      const { data } = await resp.json();
      const answer = `Bitcoin BTC - ${data.USD.price}$ ${data.USD.day}%`;

      ctx.reply(answer)
  })
}
