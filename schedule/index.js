import cron from 'node-cron';
import ct from 'countries-and-timezones';
import qb from '../database/qb.js';


export const getAllTimezonesForAllCountries = async () => {
  const countries = await qb.getCountries();
  let allTZ = [];
  for (let country in countries) {
    const tz = ct.getCountry(countries[country].iso);
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
