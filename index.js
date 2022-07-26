import {Telegraf} from 'telegraf';
import {runScheduledTasks} from "./schedule/index.js";
import {setBotActions} from "./actions/index.js";
import {setBotCommands} from "./commands/index.js";
import Sentry from '@sentry/node'
import "dotenv/config";

const PORT = process.env.PORT || 3000;
const URL = process.env.URL || 'https://obscure-sea-50068.herokuapp.com';

const bot = new Telegraf(process.env.BOT_TOKEN);

Sentry.init({
  dsn: "https://37818e6c84644246956dd9163b1bdeec@o1152440.ingest.sentry.io/6603786",
  tracesSampleRate: 1.0,
});

bot.telegram.setWebhook(`${URL}/bot${process.env.BOT_TOKEN}`);
bot.startWebhook(`/bot${process.env.BOT_TOKEN}`, null, PORT);

setBotCommands(bot);
setBotActions(bot);
runScheduledTasks(bot);

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
