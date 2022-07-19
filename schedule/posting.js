import {channels} from "../config/channels.js";

export const postToAllChannels = async (message, ctx) => {
  channels.map(channel => {
    ctx.telegram.sendMessage(channel.code, message)
  });
}
