const signup = require('express').Router();
const fetch = require('node-fetch');

signup.get('/', async (req, res) => {
    res.render('pages/signup');
})

module.exports = signup;