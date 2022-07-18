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
    return `Selected: ${this.query.country} - ${this.query.coin} at ${this.query.time}`;
  }

  save() {
    return 'Saved!'
  }

  reset() {
    this.query = {};
  }
}

export default QueryBuilder;
