// db.js : exporte le pool PostgreSQL pour réutilisation
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = pool;
