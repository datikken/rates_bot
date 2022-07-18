import sqlite3 from "sqlite3";

sqlite3.verbose();

const db = new sqlite3.Database('./tmp/database.db', sqlite3.OPEN_READWRITE, err => {
  if(err) console.log(err);
});

const sql = `CREATE TABLE IF NOT EXISTS tasks(id INTEGER PRIMARY KEY, country, timezone, time, coin)`;
db.run(sql);

export default db;
