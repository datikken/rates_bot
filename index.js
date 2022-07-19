import {Telegraf} from 'telegraf';
import {runScheduledTasks} from "./schedule/index.js";
import {setBotActions} from "./actions/index.js";
import {setBotCommands} from "./commands/index.js";
import "dotenv/config";

const PORT = process.env.PORT || 3000;
const URL = process.env.URL || 'https://obscure-sea-50068.herokuapp.com';

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.telegram.setWebhook(`${URL}/bot${process.env.BOT_TOKEN}`);
bot.startWebhook(`/bot${process.env.BOT_TOKEN}`, null, PORT);

setBotCommands(bot);
setBotActions(bot);
runScheduledTasks(bot);

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
