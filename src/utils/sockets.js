module.exports = (io) => {
    io.on('connection', (socket) => {
        const rooms = require('./rooms');
        const setPosition = require('./setPosition');
        const { typiodb, usersdb, quotesdb, q } = require('../../db');
        //new code
        socket.on('new-user', (room, name) => {
            let id = socket.id
            socket.join(room)
            if (rooms[room].timer == null && rooms[room].matchTimer == null) {
                rooms[room].timer = 10;
                rooms[room].matchTimer = 60;


            }
            if (rooms[room].matchTimer < 60 && rooms[room].matchTimer > 0) {
                io.to(socket.id).emit('enableTyping')
            }

            rooms[room].users[socket.id] = { 'name': name, "progress": 0, 'position': 0, 'CPM': 0, 'WPM': 0, 'MISTAKES': 0 }

            // console.log(rooms[room]);
            //update new user (you)
            let users = rooms[room].users;


            if (Object.keys(rooms[room].users).length == 2 && rooms[room].timer == 10) {
                var Countdown = setInterval(function () {
                    if (rooms[room].timer > 0) {
                        io.to(room).emit('timer', rooms[room].timer)
                        rooms[room].timer--;
                    }
                    else {
                        // console.log('match started');
                        io.to(room).emit('matchInit')
                        clearInterval(Countdown);
                        var MatchCountdown = setInterval(function () {
                            var count = 0;
                            let users = rooms[room].users;
                            Object.keys(users).forEach(function (key) {
                                if (users[key].progress == 1) {
                                    count++
                                }
                            })
                            if (count == Object.keys(rooms[room].users).length) {
                                // console.log('match ended1');
                                rooms[room].newGame = true;
                                io.to(room).emit('matchend');
                                clearInterval(MatchCountdown);
                            }
                            if (rooms[room].matchTimer >= 0) {
                                io.to(room).emit('Matchtimer', rooms[room].matchTimer)
                                rooms[room].matchTimer--;
                            }
                            else {
                                // console.log('match ended2');
                                rooms[room].newGame = true;
                                io.to(room).emit('matchend')
                                clearInterval(MatchCountdown);
                            }
                        }, 1000);
                    }
                }, 1000);

            }
            io.to(room).emit('user-connected', rooms[room].users, rooms[room].matchTimer);
            Object.keys(users).forEach(function (key) {
                io.to(key).emit('nameUpdate', users[key].name, key)
            })
        })

        socket.on('Stats', (room, wpm, cpm, mistakes) => {
            rooms[room].users[socket.id].WPM = wpm
            rooms[room].users[socket.id].CPM = cpm
            rooms[room].users[socket.id].MISTAKES = mistakes
        })

        socket.on('getstats', (room, fn) => [
            fn(rooms[room].users)
        ])

        socket.on('newGame', (room, username) => {
            if (rooms[room].newGame) {
                rooms[room] = { users: {}, newGame: false }
                delete rooms[room].data;
            }


        })
        socket.on('getTimeLeft', (room, fn) => {
            fn(rooms[room].matchTimer)
        })
        socket.on('progress', (progress, room) => {
            // console.log('in progress')
            rooms[room].users[socket.id].progress = progress;
            setPosition(rooms[room].users);
            // console.log(rooms[room].users);
            io.to(room).emit('progressBroadcast', rooms[room].users, socket.id);

        });
        socket.on('practiceEnd', async (wpm, mistake, cpm, timeleft, totalLetters, uandq) => {
            let score = 0
            if ((wpm - (mistake)) * timeleft > 0)
                score = (wpm - (mistake)) * timeleft;
            let accuracy = ((totalLetters - mistake) / totalLetters) * 100;
            let username = uandq.split('-')[0];
            let quoteid = uandq.split('-')[1];
            try {
                const getGameCount = async () => {
                    try {
                        const getGameCount = await typiodb.query(q.Count(
                            q.Match(q.Index("all_games"))
                        ))
                        return getGameCount
                    } catch (e) {
                        console.log({ error: e.message });
                    }
                };
                const createdGame = await typiodb.query(
                    q.Create(
                        q.Ref(q.Collection('games'), await getGameCount() + 1),
                        {
                            data: {
                                username: username,
                                quoteid: quoteid,
                                user: String(await usersdb.query(q.Call(q.Function("getUser"), username))),
                                quote: String(await quotesdb.query(q.Call(q.Function("getQuoteFromId"), quoteid))),
                                wpm: wpm,
                                score: score,
                                accuracy: accuracy,
                            },
                        },
                    )
                )
                const updatedScore = await usersdb.query(
                    q.Update(q.Select("ref", q.Get(q.Match(q.Index("user_by_username"), username))), {
                        data: {
                            score: q.Add(q.Select(["data", "score"], q.Get(q.Select("ref", q.Get(q.Match(q.Index("user_by_username"), username))))), score)
                        }
                    })
                )
            }
            catch (e) {
                console.log({ error: e });
            }

        });
        socket.on('disconnect', () => {
            let room;
            // console.log(`${socket.id} disconnected`);
            Object.keys(rooms).forEach(function (room) {
                if (rooms[room].users[socket.id]) {
                    delete rooms[room].users[socket.id]
                    // console.log(rooms);
                    io.to(room).emit('user-disconnected', rooms[room].users);
                    return;
                }
            });
        });
        //new code end

    });
};