import {countries} from "../config/countries.js";
import {coins} from "../config/coins.js";
import {Markup} from "telegraf";

export const getAllCountryButtons = () => {
  let res = [];
  for(let country in countries) {
        res.push([Markup.button.callback(`${countries[country]} ${country}`, `${country}`)]);
  }
  return res;
};

export const getAllCoinButtons = () => {
  let res = [];
  coins.map(coin => {
    res.push([Markup.button.callback(`${coin.symbol} ${coin.name}`, `${coin.symbol}`)]);
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
