const dotenv = require('dotenv');
dotenv.config();

const faunadb = require('faunadb'),
    q = faunadb.query;

const typiodb = new faunadb.Client({
    secret: process.env.TYPIO_SECRET,
    domain: 'db.us.fauna.com',
});

const quotesdb = new faunadb.Client({
    secret: process.env.TYPIO_QUOTES_SECRET,
    endpoint: 'https://db.fauna.com/',
});

const usersdb = new faunadb.Client({
    secret: process.env.TYPIO_USERS_SECRET,
    endpoint: 'https://db.fauna.com/',
});


module.exports = { typiodb: typiodb, usersdb: usersdb, quotesdb: quotesdb, q: q };