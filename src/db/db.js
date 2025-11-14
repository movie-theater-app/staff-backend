const { Pool, types} = require('pg');
require('dotenv').config();

types.setTypeParser(1082, (val) => val); // return the raw string "YYYY-MM-DD"

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
});

async function query(text, params) {
    return await pool.query(text, params);
}

module.exports = {
    query,
};

