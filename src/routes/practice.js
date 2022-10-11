const practice = require('express').Router();
const fetch = require('node-fetch');

practice.get('/', async (req, res) => {
    // GET request to the API endpoint using the fetch.
    // apiList = [`https://free-quotes-api.herokuapp.com/`, `https://animechan.vercel.app/api/random`, `https://programming-quotes-api.herokuapp.com/Quotes/random`, `https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw&type=single`];
    // Did not include the above list because the structure of the json file is different and have to figure it out.
    // apiList = [`https://free-quotes-api.herokuapp.com/`];
    apiList = [`http://metaphorpsum.com/paragraphs/1/3?format=json`];
    const apiURL = apiList[Math.floor(Math.random() * apiList.length)];
    try {
        await fetch(apiURL)
            .then(res => res.json())
            .then(data => {
                const para = data.text;
                res.render('pages/practice', {
                    para
                })
            });
    } catch (err) {
        console.log(err);
    }
})

module.exports = practice;
