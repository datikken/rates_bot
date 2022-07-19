import cron from 'node-cron';
// import {countries} from "../config/countries.js";
import ct from 'countries-and-timezones';
import qb from '../database/qb.js';

const countries = [];

export const getAllTimezonesForAllCountries = () => {
  let allTZ = [];
  for (let country in countries) {
    const tz = ct.getCountry(country);
    tz.timezones.map(tzVariant => allTZ.push(tzVariant))
  }
  return allTZ;
}

export const runScheduledTasks = async (fn) => {
  const tasks = await qb.getTasks();
  tasks.map(task => {
    cron.schedule(task.time, () => {
      fn();
    }, {
      scheduled: true,
      timezone: task.timezone
    });
  });
}
