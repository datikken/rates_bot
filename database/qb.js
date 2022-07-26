import db from './database.js'
import ct from 'countries-and-timezones';

class QueryBuilder {
  constructor() {
    this.query = {};
  }

  async execGetSql(query) {
    return new Promise((resolve, reject) => {
      db.get(query, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }
  async execAllSql(query) {
    return new Promise((resolve, reject) => {
      db.all(query, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  async getChannelByCountry(id) {
    const sql = `SELECT * FROM channels where country_id = ${id}`;
    return await this.execGetSql(sql);
  }

  async getCoinById(id) {
    const sql = `SELECT * FROM coins WHERE id = ${id}`;
    return await this.execGetSql(sql);
  }

  async getCountryById(id) {
    const sql = `SELECT * FROM countries WHERE id = ${id}`;
    return await this.execGetSql(sql);
  }

  async getCoins() {
    const sql = 'SELECT * FROM coins';
    return await this.execAllSql(sql);
  }

  async getCountry() {
    return this.query.country;
  }

  async addCountry(id) {
    this.query.country = await this.getCountryById(id);
  }

  async getCountries() {
    const sql = 'SELECT * FROM countries';
    return await this.execAllSql(sql);
  }

  async addCoin(coin) {
    this.query.coin = await this.getCoinById(coin);
  }

  async addTime(hour) {
    this.query.time = await this.getCronFormatedTimeString(hour);
  }

  async addTimezone(tz) {
    this.query.tz = tz;
  }

  async getTotal() {
    return `${this.query.country.iso} ${this.query.country.flag} ${this.query.tz ?? ''} ${this.query.coin.symbol} at ${this.query.time}`;
  }

  async getCronFormatedTimeString(hour) {
    return `0 ${hour} * * *`;
  }

  async getTimeZoneByCountry(country) {
    return ct.getCountry(country).timezones;
  }

  async getTasks() {
    const sql = `SELECT * FROM tasks`;
    return await this.execAllSql(sql);
  }

  async save() {
    const sql = `INSERT INTO tasks(time, channel_id, coin_id, country_id) VALUES (?,?,?,?)`;
    const channel = await this.getChannelByCountry(this.query.country.id);
    const arrToSave = [this.query.time, channel.id, this.query.coin.id, this.query.country.id];
    await db.run(sql, arrToSave, err => {
        if(err) console.log(err)
      }
    )
    await this.reset();
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
