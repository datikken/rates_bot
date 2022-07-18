import sqlite3 from "sqlite3";

sqlite3.verbose();

const db = new sqlite3.Database('./tmp/database.db', sqlite3.OPEN_READWRITE, err => {
  if(err) console.log(err);
});

// To create table:
// const sql = `CREATE TABLE IF NOT EXISTS countries(id INTEGER PRIMARY KEY, name, code, flag, status)`;
// const sql = `CREATE TABLE IF NOT EXISTS coins(id INTEGER PRIMARY KEY, name, symbol)`;
// db.run(sql);

// To insert data:
// const sql = `INSERT INTO users(first_name, last_name, username, password, email) VALUES (?,?,?,?,?)`;
// db.run(sql, ['fred', 'fergusson', 'fred_user', 'testtwo', 'fred@mail.ru'], err => {
//     if(err) console.log(err)
//   }
// )

export default db;
