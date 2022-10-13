const { usersdb, q } = require('../../db');


const leaderBoardScores = await usersdb.query(
    q.Paginate(q.Match(q.Index('username_sort_by_score_desc'))),
)

console.log(leaderBoardScores);