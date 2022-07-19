import {coins} from "../config/coins.js";
import {Markup} from "telegraf";
import qb from './qb.js';
import {CallbackData} from '@bot-base/callback-data';

export const deleteData = new CallbackData('delete', ['id']);
export const countryData = new CallbackData('create_country', ['id']);

export const getAllCountryButtons = async () => {
  const countries = await qb.getCountries();
  let res = [];
  for (let country in countries) {
    res.push([
      Markup.button.callback(`${countries[country].name} ${countries[country].iso} ${countries[country].flag}`,
          countryData.create({
            type: 'add_country',
            id: countries[country].id,
          })
      )]);
  }
  return res;
};

export const getAllCoinButtons = () => {
  let res = [];
  coins.map(coin => {
    res.push([
      Markup.button.callback(`${coin.symbol} ${coin.name}`, `${coin.symbol}`)]);
  })
  return res;
}

export const getFinalButtons = () => {
  return [
    Markup.button.callback('Reset', 'reset'),
    Markup.button.callback('Save', 'save'),
  ]
}

export const getTimezonesButtons = (tz) => {
  let res = [];
  tz.map(tzStr => {
    res.push([Markup.button.callback(`${tzStr}`, `${tzStr}`)]);
  })
  return res;
}

export const getAllTasksButtons = async () => {
  const tasks = await qb.getTasks();
  let res = [];
  tasks.map(el => {
    res.push([
      Markup.button.callback(
          `${el.country} - ${el.timezone} - ${el.time} - ${el.coin}   ❌`,
          deleteData.create({
            type: 'delete',
            id: el.id,
          })
      )])
  });
  return res;
}
