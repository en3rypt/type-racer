const dotenv = require('dotenv');
dotenv.config();

const faunadb = require('faunadb'),
    q = faunadb.query;

let client = new faunadb.Client({
    secret: process.env.FAUNAKEY,
    // NOTE: Use the correct endpoint for your database's Region Group.
    endpoint: 'https://db.fauna.com/',
})

module.exports = { db: client, q: q };