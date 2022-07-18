import db from './database.js'

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
    return `Selected: ${this.query.country} - ${this.query.tz ?? this.query.tz} - ${this.query.coin} at ${this.query.time}`;
  }

  getCronFormatedTimeString() {
    return `* * ${this.query.time} * * *`;
  }

  save() {
    const sql = `INSERT INTO tasks(country, timezone, time, coin) VALUES (?,?,?,?)`;
    db.run(sql, [this.query.country, this.query.tz, this.getCronFormatedTimeString(), this.query.coin], err => {
        if(err) console.log(err)
      }
    )
    return 'Saved!'
  }

  reset() {
    this.query = {};
  }
}

export default QueryBuilder;
