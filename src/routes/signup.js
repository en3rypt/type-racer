const signup = require('express').Router();
const { usersdb, q } = require('../../db');
const fetch = require('node-fetch');
const sendEmail = require('../utils/email');
const { v4: uuidv4 } = require('uuid');

const getuserCount = async () => {
    try {
        const getuserCount = await usersdb.query(q.Count(
            q.Match(q.Index("all_users"))
        ))
        return getuserCount
    } catch (e) {
        console.log({ error: e.message });
    }
};


signup.get('/', async (req, res) => {
    res.render('pages/signup', { error: '' });
})
signup.post('/', async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
        res.render('pages/signup', { error: 'Passwords do not match' });
    } else {
        try {
            let users = await usersdb.query(
                q.Paginate(
                    q.Match(q.Index("user_by_username"), username)
                ),
            );
            if (users.data.length == 1) {
                res.render('pages/signup', { error: 'Username already exists' });
            } else {
                users = await usersdb.query(
                    q.Paginate(
                        q.Match(q.Index("user_by_email"), email)
                    ),
                );
                if (users.data.length == 1) {
                    res.render('pages/signup', { error: 'Email already exists' });
                } else {
                    const createdUser = await usersdb.query(
                        q.Create(
                            q.Ref(q.Collection('users'), await getuserCount() + 1),
                            {
                                credentials: {
                                    password: password
                                },
                                data: {
                                    username: username,
                                    email: email,
                                    score: 0,
                                    trackcount: 0,
                                    highestwpm: 0,
                                    avgwpm: 0,
                                }
                            }
                        )
                    );
                    res.render('pages/signup', { error: 'User created' });
                }
            }
        }
        catch (e) {
            console.log({ error: e.message });
        }
    }
});

module.exports = signup;