import {channels} from "../config/channels.js";
import {getCoinPrice} from "../ticker/index.js";
import {getFormatedMessage} from "../util/index.js";


export const postToAllChannels = async (coin, bot) => {
  const data = await getCoinPrice(coin)
  const answer = await getFormatedMessage(coin, data);

  channels.map(channel => {
    bot.telegram.sendMessage(channel.code, answer)
  });
}
