import qb from "../database/qb.js";
import ct from "countries-and-timezones";
import {
  countryData,
  getAllCoinButtons,
  getFinalButtons,
  getTimezonesButtons
} from "../database/button.js";
import {coins} from "../config/coins.js";
import {TimePicker} from "telegraf-time-picker";
import {getAllTimezonesForAllCountries} from "../schedule/index.js";
import {deleteData} from "../database/button.js";
import { Markup, deunionize } from 'telegraf';

export const setBotActions = async (bot) => {
  const timePicker = new TimePicker(bot);
  const allTimezones = await getAllTimezonesForAllCountries();

  bot.action(
      deleteData.filter({
        action: 'delete'
      }),
      async (ctx) => {
        const { id } = deleteData.parse(
            deunionize(ctx.callbackQuery).data
        );
        await qb.deleteTask(id);
      }
  );

  bot.action(
      countryData.filter({
        action: 'add_country'
      }),
      async ctx => {
        const { id } = countryData.parse(
            deunionize(ctx.callbackQuery).data
        );

        await qb.addCountry(id);

        const selectedCountry = qb.getCountry()
        const tz = ct.getCountry(selectedCountry.iso);

        ctx.reply('Country accepted!');

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
      }
  )

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
