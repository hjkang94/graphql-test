require('dotenv').config();
const pgPromise = require('pg-promise');

const pgp = pgPromise({});

const config = {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DB,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
};

const db = pgp(config);

exports.db = db;