const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "jukira",
  password: "fire",
  port: 5432,
});

pool.on('connect', () => {
  console.log('Database connected successfully!');
});

pool.on('error', (err) => {
  console.error('Database error:', err.message, err.stack);
});

module.exports = pool;
