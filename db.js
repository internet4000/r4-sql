const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database('r4.sqlite')

module.exports = db
