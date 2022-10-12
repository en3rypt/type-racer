const profile = require('express').Router();
const { requireAuth, checkUser } = require('../middleware/auth');
const { typiodb, usersdb, q } = require('../../db');


profile.get('/:username', requireAuth, async (req, res) => {
    const username = req.params.username;
    try {
        const user = await usersdb.query(
            q.Get(q.Match(q.Index('user_by_username'), username))
        )
        res.render('pages/profile', { user: user.data });
    } catch (e) {
        console.log({ error: e.message });
    }
});

module.exports = profile;