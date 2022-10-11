const signup = require('express').Router();
const fetch = require('node-fetch');
const sendEmail = require('../utils/email');
const { v4: uuidv4 } = require('uuid');


signup.get('/', async (req, res) => {
    res.render('pages/signup');
})
signup.post('/', async (req, res) => {

    const { username, email, password, confirmPassword } = req.body;
    console.log(username, email, password, confirmPassword);


})

module.exports = signup;