//DATABASE CONNECTION
require('dotenv').config();
const { Pool } = require('pg');

// Create a connection pool
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

// Test the database connection
pool.connect()
    .then(() => console.log("Connected to PostgreSQL database"))
    .catch(err => console.error("Database connection error", err.stack));

module.exports = pool;