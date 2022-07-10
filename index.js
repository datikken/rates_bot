import { Telegraf } from 'telegraf'
import {channels} from "./config/channels.js";
import 'dotenv/config'

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.command('quit', (ctx) => {
  ctx.telegram.leaveChat(ctx.message.chat.id)
  ctx.leaveChat()
})

bot.on('message', (ctx) => {
  // ctx.message.text
  console.log(ctx.message.text)
  ctx.telegram.sendMessage(channels.shadybekov_channel_2, `Hello ${ctx.state}`)
})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
