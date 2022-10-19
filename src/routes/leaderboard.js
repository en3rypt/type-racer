const leaderboard = require('express').Router();
const { usersdb, q } = require('../../db');


leaderboard.get('/', async (req, res) => {
    try {
        const leaderBoardScores = await usersdb.query(
            q.Paginate(q.Match(q.Index('username_sort_by_score_desc'))),
        )
        res.render('pages/leaderboard', { leaderboard: leaderBoardScores.data})
    } catch (e) {
        console.log({error: e})
    }
})


module.exports = leaderboard;