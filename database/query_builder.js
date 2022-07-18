import db from './database.js'
import ct from 'countries-and-timezones';

class QueryBuilder {
  constructor() {
    this.query = {};
  }

  addCountry(country) {
    this.query.country = country;
  }

  addCoin(coin) {
    this.query.coin = coin;
  }

  addTime(timestamp) {
    this.query.time = timestamp;
  }

  addTimezone(tz) {
    this.query.tz = tz;
  }

  getTotal() {
    return `Selected: ${this.query.country} - ${this.query.tz ? this.query.tz : this.getTimeZoneByCountry(this.query.country)} - ${this.query.coin} at ${this.query.time}`;
  }

  getCronFormatedTimeString() {
    return `* * ${this.query.time} * * *`;
  }

  getTimeZoneByCountry(country) {
    return ct.getCountry(country).timezones;
  }

  async getTasks() {
    const sql = `SELECT * FROM tasks`;
    return new Promise((resolve, reject) => {
      db.all(sql, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  save() {
    const sql = `INSERT INTO tasks(country, timezone, time, coin) VALUES (?,?,?,?)`;
    let tz = this.query.tz;

    if(!tz) {
      tz = this.getTimeZoneByCountry(this.query.country)
    }

    db.run(sql, [this.query.country, tz, this.getCronFormatedTimeString(), this.query.coin], err => {
        if(err) console.log(err)
      }
    )
    this.reset();
    return 'Saved!';
  }

  reset() {
    this.query = {};
  }
}

const qb = new QueryBuilder();

export default qb;
