import cron from 'node-cron';
import ct from 'countries-and-timezones';
import qb from '../database/qb.js';
import {postToAllChannels} from "./posting.js";


export const getAllTimezonesForAllCountries = async () => {
  const countries = await qb.getCountries();
  let allTZ = [];
  for (let country in countries) {
    const tz = ct.getCountry(countries[country].iso);
    tz.timezones.map(tzVariant => allTZ.push(tzVariant))
  }
  return allTZ;
}

export const runScheduledTasks = async bot => {
  const tasks = await qb.getTasks();
  tasks.slice(0, 2).map(task => {
    cron.schedule(task.time, () => {
      postToAllChannels(task.coin, bot);
    });
  })
}
