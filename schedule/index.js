import cron from 'node-cron';
import ct from 'countries-and-timezones';
import qb from '../database/qb.js';
import {postTasksToChannel} from "./posting.js";
import _ from "lodash";

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
  const grouped = _.groupBy(tasks, el => [el.timezone, el.channel_id, el.time]);
  for (let group in grouped) {
    const groupTime = group.split(',')[2];
    const groupTimeZone = group.split(',')[0];
    cron.schedule(groupTime, async () => {
      await postTasksToChannel(grouped[group], bot);
    }, {
      scheduled: true,
      timezone: groupTimeZone
    });
  }
};
