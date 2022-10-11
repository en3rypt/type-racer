const login = require('express').Router();
const fetch = require('node-fetch');

login.get('/', async (req, res) => {
    res.render('pages/login');
})

module.exports = login;