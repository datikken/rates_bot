import {Telegraf} from 'telegraf';
import {runScheduledTasks} from "./schedule/index.js";
import {setBotActions} from "./actions/index.js";
import {setBotCommands} from "./commands/index.js";
import "dotenv/config";

// import { channels } from "./config/channels.js";

const bot = new Telegraf(process.env.BOT_TOKEN)

setBotCommands(bot)
setBotActions(bot)
runScheduledTasks();

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
