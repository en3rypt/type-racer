const login = require('express').Router();
const fetch = require('node-fetch');

login.get('/', async (req, res) => {
    res.render('pages/login');
})

login.post('/', (req, res) => {
    const { username, password } = req.body;
    console.log(username, password);
})
module.exports = login;