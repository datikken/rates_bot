import qb from '../database/qb.js';
import {getCoinPrice} from "../ticker/index.js";

export const prepareMessageByTaskArr = async arr => {
  return Promise.all(arr.map(async el => {
    const coin = await qb.getCoinById(el.coin_id);
    const country = await qb.getCountryById(el.country_id);
    const data = await getCoinPrice(coin.symbol);
    return `${country.name} (${coin.symbol}) - ${data[country.currency].price} ${country.currency} ${data[country.currency].day}%`;
  }));
};
