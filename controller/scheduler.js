import db from '../database/database.js';
import cron from 'node-cron';
import {countries} from "../config/countries.js";
import ct from 'countries-and-timezones';

// cron.schedule('0 1 * * *', () => {
//   console.log('Running a job at 01:00 at America/Sao_Paulo timezone');
// }, {
//   scheduled: true,
//   timezone: "America/Sao_Paulo"
// });

export const getAllTimezonesForAllCountries = () => {
  let allTZ = [];
  for (let country in countries) {
    const tz = ct.getCountry(country);
    tz.timezones.map(tzVariant => allTZ.push(tzVariant))
  }
  return allTZ;
}

export const runScheduledTasks = () => {
  db.get();
}
