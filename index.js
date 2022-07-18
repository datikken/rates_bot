import {Telegraf} from 'telegraf';
import {runScheduledTasks} from "./controller/scheduler.js";
import {setBotActions} from "./actions/index.js";
import {setBotCommands} from "./commands/index.js";
import "dotenv/config";

// import { channels } from "./config/channels.js";
// import cron from 'node-cron';
// import fetch from 'node-fetch';

const bot = new Telegraf(process.env.BOT_TOKEN)

// console.log(await qb.getTasks())

setBotCommands(bot)
setBotActions(bot)
runScheduledTasks();

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
