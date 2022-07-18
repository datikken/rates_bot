import {
  getAllCoinButtons,
  getAllCountryButtons,
  getFinalButtons
} from "./database/button.js";
import { Markup, Telegraf } from 'telegraf';
import QueryBuilder from "./database/query_builder.js";
import 'dotenv/config'
import db from './database/database.js';
import {countries} from "./config/countries.js";
import {coins} from "./config/coins.js";
import {TimePicker} from "telegraf-time-picker";

// import { channels } from "./config/channels.js";
// import cron from 'node-cron';
// import fetch from 'node-fetch';

// Instances
const bot = new Telegraf(process.env.BOT_TOKEN)
const qb = new QueryBuilder();
const timePicker = new TimePicker(bot);

// Commands
bot.command('a', async (ctx) => {
  try {
    await ctx.replyWithHTML(`<b>Select country:</b>`, Markup.inlineKeyboard([
        ...getAllCountryButtons(),
    ]))
  } catch (e) {
    console.error(e)
  }
})

// Actions
for(let country in countries) {
  bot.action(country, async ctx => {
    qb.addCountry(ctx.match.input)
    ctx.reply('Country accepted!');

    try {
      await ctx.replyWithHTML(`<b>Select coins:</b>`, Markup.inlineKeyboard([
        ...getAllCoinButtons(),
      ]))
    } catch (e) {
      console.error(e)
    }
  });
}
coins.map(coin => {
  bot.action(coin.symbol, async ctx => {
    qb.addCoin(ctx.match.input);
    ctx.reply('Coin accepted!');

    try {
      await ctx.reply('Choose the hour:', timePicker.getTimePicker('0'));
    } catch (e) {
      console.error(e)
    }
  })
})
bot.action('reset', ctx => {
  qb.reset();
})
bot.action('save', ctx => {
  qb.save();
})
timePicker.setTimePickerListener((context, time) => {
  qb.addTime(time);
  //reply as proper
  context.reply(qb.getTotal(), Markup.inlineKeyboard([
      ...getFinalButtons()
  ]));
});


bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
