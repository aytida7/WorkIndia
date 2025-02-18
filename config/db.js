const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL, 
});

pool.on('connect', () => {
    console.log('Connected to PostgreSQL');
});

// Handling the errors for connection
pool.on('error', (err) => {
    console.error('PostgreSQL Error:', err.message);
    process.exit(1);
});

module.exports = pool; 
