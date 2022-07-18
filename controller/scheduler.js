import db from '../database/database.js';
import cron from 'node-cron';

// cron.schedule('0 1 * * *', () => {
//   console.log('Running a job at 01:00 at America/Sao_Paulo timezone');
// }, {
//   scheduled: true,
//   timezone: "America/Sao_Paulo"
// });

export const runScheduledTasks = () => {
  db.get();
}
