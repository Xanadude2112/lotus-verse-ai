const pg = require('pg');
require('dotenv').config();

const dbParams = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
};

const db = new pg.Pool(dbParams);

db.connect()
  .then(() => {
    console.log('Connected to the database', dbParams.database, '👹');
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err);
  });

module.exports = db;