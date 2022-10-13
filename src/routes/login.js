const login = require('express').Router();
const { usersdb, q } = require('../../db');
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');

login.get('/', async (req, res) => {
    res.render('pages/login', { error: '' });
})

login.post('/', async (req, res) => {
    const { username, password } = req.body;
    try {

        const user = await usersdb.query(
            q.Login(q.Match(q.Index('user_by_username'), username), { password: password },))

        var payload = {
            username: username,
            user: user
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
        // console.log(token);
        // res.locals.username = username;
        return res.cookie("typio_access_token", token, {
            httpOnly: true,
            maxAge: 86400000,
        }).status(200).redirect('/');

    }
    catch (e) {
        if (e.message == 'authentication failed') {
            res.render('pages/login', { error: 'Username or password doesnot match.' });
        } else {
            res.render('pages/login', { error: e.message });
        }
    }
})
module.exports = login;