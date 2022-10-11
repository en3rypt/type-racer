const practice = require('express').Router();
const { quotesdb, q } = require('./../../db');

const getQuoteCount = async () => {
    try {
        const getQuoteCount = await quotesdb.query(q.Count(
            q.Match(q.Index("all_quotes"))
        ))
        return getQuoteCount
    } catch (e) {
        console.log({ error: e.message });
    }
};

const getQuote = async () => {
    try {
        const getQuote = await quotesdb.query(q.Map(
            q.Paginate(
                q.Match(q.Index("quote_by_quoteid"), Math.floor(Math.random() * await getQuoteCount()))
            ),
            q.Lambda("X", q.Get(q.Var("X")))
        ))
        return getQuote.data[0];
    } catch (e) {
        console.log({ error: e.message });
    }
};

practice.get('/', async (req, res) => {
    // GET request to the API endpoint using the fetch.
    // apiList = [`https://free-quotes-api.herokuapp.com/`, `https://animechan.vercel.app/api/random`, `https://programming-quotes-api.herokuapp.com/Quotes/random`, `https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw&type=single`];
    // Did not include the above list because the structure of the json file is different and have to figure it out.
    // apiList = [`https://free-quotes-api.herokuapp.com/`];
    // apiList = [`http://metaphorpsum.com/paragraphs/1/3?format=json`];
    // const apiURL = apiList[Math.floor(Math.random() * apiList.length)];
    try {
        // await fetch(apiURL)
        // .then(res => res.json())
        // .then(data => {
        // const para = data.text;
        const para = await getQuote();
        res.render('pages/practice', {
            quote: para.data.quoteText,
            ref: para.ref
        })
        // });
    } catch (err) {
        console.log(err);
    }
})

module.exports = practice;
