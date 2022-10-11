const dotenv = require('dotenv');
dotenv.config();

const faunadb = require('faunadb'),
    q = faunadb.query;

let quotesdb = new faunadb.Client({
    secret: process.env.TYPIO_QUOTES_SECRET,
    // NOTE: Use the correct endpoint for your database's Region Group.
    endpoint: 'https://db.fauna.com/',
})





module.exports = { quotesdb: quotesdb, q: q };