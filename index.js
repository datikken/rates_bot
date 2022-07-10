import { Telegraf } from 'telegraf';
import { channels } from "./config/channels.js";
import 'dotenv/config'
import fetch from 'node-fetch';

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears(/([.])\w{0,4}/, async (ctx) => {
  ctx.reply('Hey there')
  fetch('https://jsonplaceholder.typicode.com/photos/1')
      .then(res => res.json())
      .then(data => {
        console.log(data)
        ctx.telegram.sendMessage(channels.shadybekov_channel_2, JSON.stringify(data))
      })
      .catch(err => console.log(err))
})
bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
