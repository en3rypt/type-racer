const login = require('express').Router();
const { usersdb, q } = require('../../db');
const fetch = require('node-fetch');

login.get('/', async (req, res) => {
    res.render('pages/login', { error: '' });
})

login.post('/', async (req, res) => {
    const { username, password } = req.body;
    try {
        const users = await usersdb.query(
            q.Paginate(q.Match(q.Index('username_by_user'))),
        );
        if (users.data.includes(username)) {
            const user = await usersdb.query(q.Map(
                q.Paginate(
                    q.Match(q.Index("user_by_username"), username)
                ),
                q.Lambda("X", q.Get(q.Var("X")))
            )
            );
            if (user.data[0].data.password === password) {
                res.render('pages/login', { error: 'User can be logged in.' });
            } else {
                res.render('pages/login', { error: 'Wrong password.' });
            }
        } else {
            res.render('pages/login', { error: 'Username does not exist.' });
        }
    }
    catch (e) {
        console.log({ error: e.message });
    }
})
module.exports = login;