import sqlite3 from "sqlite3";

sqlite3.verbose();

const db = new sqlite3.Database('./tmp/database.db', sqlite3.OPEN_READWRITE, err => {
  if(err) console.log(err);
});

export default db;
