import {prepareMessageByTaskArr} from "../util/index.js";

export const postTasksToChannel = async (tasksArr, bot) => {
  const message = await prepareMessageByTaskArr(tasksArr);
  bot.telegram.sendMessage('-1001510060014', await message.join('\n'));
};
