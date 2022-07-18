import {coins} from "../config/coins.js";

export const getFormatedMessage = async (coin, data) => {
  const { name } = coins.find(el => el.symbol === coin);
  return `${name} ${coin} - ${data.USD.price}$ ${data.USD.day}%`;
}
