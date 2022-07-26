import qb from '../database/qb.js';

export const getFormatedMessage = async (coin, data) => {
  const coins = await qb.getCoins();
  const { name } = coins.find(el => el.symbol === coin);
  return `${name} ${coin} - ${data.USD.price}$ ${data.USD.day}%`;
}
