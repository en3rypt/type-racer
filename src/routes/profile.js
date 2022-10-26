const profile = require('express').Router();
const { requireAuth, checkUser } = require('../middleware/auth');
const { typiodb, usersdb, q } = require('../../db');


profile.get('/:username', requireAuth, async (req, res) => {
    const username = req.params.username;
    try {
        const user = await usersdb.query(
            q.Get(q.Match(q.Index('user_by_username'), username))
        )
        const gameCount = await typiodb.query(
            q.Count(q.Match(q.Index('games_by_username'), username))
        )
        const sortedScore = await usersdb.query(
            q.Paginate(q.Match(q.Index('username_sort_by_score_desc'))),
        )
        const rank = sortedScore.data.findIndex((user) => user[1] === username) + 1;
        if (gameCount) {
            const highestWPM = await typiodb.query(
                q.Max(q.Paginate(q.Match(q.Index('wpm_by_username_sort_by_wpm_desc'), username)))
            )
            const averageWPM = await typiodb.query(
                q.Mean(q.Paginate(q.Match(q.Index('wpm_by_username_sort_by_wpm_desc'), username)))
            )
            res.render('pages/profile', { user: user.data, gameCount: gameCount, highestWPM: highestWPM.data, averageWPM: averageWPM.data, rank: rank });
        }
        else {
            res.render('pages/profile', { user: user.data, gameCount: gameCount, highestWPM: 0, averageWPM: 0, rank: rank });
        }
    } catch (e) {
        console.log({ error: e });
    }
});

module.exports = profile;   