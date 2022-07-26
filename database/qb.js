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

  async getCoins() {
    return  new Promise((resolve, reject) => {
      db.all('SELECT * FROM coins', (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  async getCountry() {
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

  async addCoin(coin) {
    this.query.coin = coin;
  }

  async addTime(timestamp) {
    this.query.time = timestamp;
  }

  async addTimezone(tz) {
    this.query.tz = tz;
  }

  async getTotal() {
    return `
    Selected:
     ${this.query.country.name} - 
     ${this.query.tz ? this.query.tz : this.getTimeZoneByCountry(this.query.country.iso)} - 
     ${await this.getCoins()[this.query.coin]} at 
     ${this.query.time}
     `;
  }

  async getCronFormatedTimeString() {
    return `* * ${this.query.time} * * *`;
  }

  async getTimeZoneByCountry(country) {
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

  async save() {
    const sql = `INSERT INTO tasks(time, channel_id, coin_id, country_id) VALUES (?,?,?,?)`;
    let tz = this.query.tz;

    if(!tz) {
      tz = this.getTimeZoneByCountry(this.query.country.iso)
    }

    db.run(sql, [
        this.getCronFormatedTimeString(),
        this.query.channel_id,
        this.query.coin_id,
        this.query.country_id
      ], err => {
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

  async reset() {
    this.query = {};
  }
}

const qb = new QueryBuilder();

export default qb;
