import {countries} from "../config/countries.js";
import qb from "../database/query_builder.js";
import ct from "countries-and-timezones";
import {Markup} from "telegraf";
import {
  getAllCoinButtons,
  getFinalButtons,
  getTimezonesButtons
} from "../database/button.js";
import {coins} from "../config/coins.js";
import {TimePicker} from "telegraf-time-picker";
import {getAllTimezonesForAllCountries} from "../schedule/scheduler.js";

export const setBotActions = (bot) => {
  const timePicker = new TimePicker(bot);
  const allTimezones = getAllTimezonesForAllCountries();

  for (let country in countries) {
    bot.action(country, async ctx => {
      const selectedCountry = ctx.match.input;
      qb.addCountry(selectedCountry)
      ctx.reply('Country accepted!');
      const tz = ct.getCountry(selectedCountry);
      if (tz.timezones.length > 1) {
        try {
          await ctx.replyWithHTML(`<b>Select timezone:</b>`,
              Markup.inlineKeyboard([
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
}
