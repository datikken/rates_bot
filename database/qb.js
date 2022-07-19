import db from './database.js'
import ct from 'countries-and-timezones';

class QueryBuilder {
  constructor() {
    this.query = {};
  }

  async getCountryById(id) {
    const sql = `SELECT * FROM countries WHERE id = ${id}`;
    return new Promise((resolve, reject) => {
      db.get(sql, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  getCountry() {
    return this.query.country;
  }

  async addCountry(id) {
    this.query.country = await this.getCountryById(id);
  }

  async getCountries() {
    return  new Promise((resolve, reject) => {
      db.all('SELECT * FROM countries', (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
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
    return `Selected: ${this.query.country.name} - ${this.query.tz ? this.query.tz : this.getTimeZoneByCountry(this.query.country.iso)} - ${this.query.coin} at ${this.query.time}`;
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
      tz = this.getTimeZoneByCountry(this.query.country.iso)
    }

    db.run(sql, [this.query.country.iso, tz, this.getCronFormatedTimeString(), this.query.coin], err => {
        if(err) console.log(err)
      }
    )
    this.reset();
    return 'Saved!';
  }

  async deleteTask(id) {
    const sql = `DELETE FROM tasks where id = ${id}`;
    return await db.run(sql);
  }

  reset() {
    this.query = {};
  }
}

const qb = new QueryBuilder();

export default qb;
