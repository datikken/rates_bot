import {
  getAllCoinButtons,
  getAllCountryButtons,
  getFinalButtons,
  getTimezonesButtons
} from "./database/button.js";
import {getAllTimezonesForAllCountries} from "./controller/scheduler.js";
import { Markup, Telegraf } from 'telegraf';
import QueryBuilder from "./database/query_builder.js";
import 'dotenv/config'
import db from './database/database.js';
import {countries} from "./config/countries.js";
import {coins} from "./config/coins.js";
import {TimePicker} from "telegraf-time-picker";
import ct from 'countries-and-timezones';

// import { channels } from "./config/channels.js";
// import cron from 'node-cron';
// import fetch from 'node-fetch';

// Instances
const bot = new Telegraf(process.env.BOT_TOKEN)
const qb = new QueryBuilder();
const timePicker = new TimePicker(bot);
const allTimezones = getAllTimezonesForAllCountries();

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
    const selectedCountry = ctx.match.input;
    qb.addCountry(selectedCountry)
    ctx.reply('Country accepted!');
    const tz = ct.getCountry(selectedCountry);
    if(tz.timezones.length > 1) {
      try {
        await ctx.replyWithHTML(`<b>Select timezone:</b>`, Markup.inlineKeyboard([
          ...getTimezonesButtons(tz.timezones),
        ]))
      } catch (e) {
        console.error(e)
      }
    } else {
      try {
        await ctx.replyWithHTML(`<b>Select coins:</b>`, Markup.inlineKeyboard([
          ...getAllCoinButtons(),
        ]))
      } catch (e) {
        console.error(e)
      }
    }
  });
}
allTimezones.map(tz => {
  bot.action(tz, async ctx => {
    qb.addTimezone(ctx.match.input);
    ctx.reply('Timezone accepted!');
    try {
      await ctx.replyWithHTML(`<b>Select coins:</b>`, Markup.inlineKeyboard([
        ...getAllCoinButtons(),
      ]))
    } catch (e) {
      console.error(e)
    }
  })
})
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
  ctx.replyWithHTML(`<b>Jobs done.</b>`)
})

bot.action('save', ctx => {
  qb.save();
  ctx.replyWithHTML(`<b>Jobs done.</b>`)
})

timePicker.setTimePickerListener((context, time) => {
  qb.addTime(time);
  context.reply(qb.getTotal(), Markup.inlineKeyboard([
      ...getFinalButtons()
  ]));
});

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
