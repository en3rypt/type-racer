const express = require('express');
const app = express();
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const cors = require('cors');
const PORT = process.env.PORT || 3000
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fetch = require('node-fetch');
const { createSocket } = require('dgram');
var session = require('express-session');
const e = require('cors');

const rooms = {};
const data = {};

//user defined modules
const makeid = () => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < 10; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

const getQuote = async () => {
    apiList = [`https://free-quotes-api.herokuapp.com/`];
    const apiURL = apiList[Math.floor(Math.random() * apiList.length)];
    try {
        await fetch(apiURL)
            .then(res => res.json())
            .then(data => {
                return data.quote;

            });
    } catch (err) {
        return 0;
    }
}


function setPosition(users) {
    // console.log('fuinction called');
    let userPositions = {}
    Object.keys(users).forEach(function (key) {
        userPositions[key] = users[key].progress;

    });
    // console.log(userPositions);
    //sort userPositions
    let sorted = Object.keys(userPositions).sort(function (a, b) {
        return userPositions[b] - userPositions[a];
    }
    );
    //update users position with sorted array
    let i = 1;
    sorted.forEach(function (key) {
        users[key].position = i;
        i++;
    });



}


//scoket connection

const countDownTimer = (rooms) => {

    if (rooms[room].timer > 0) {
        io.to(room).emit('timer', rooms[room].timer)
        rooms[room].timer--;
    }
    else {
        io.to(room).emit('matchStart', 'True')
    }

}
io.on('connection', (socket) => {


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

        rooms[room].users[socket.id] = { 'name': name, "progress": 0, 'position': 0 }

        console.log(rooms[room]);
        //update new user (you)
        let users = rooms[room].users;


        if (Object.keys(rooms[room].users).length == 2 && rooms[room].timer == 10) {
            var Countdown = setInterval(function () {
                if (rooms[room].timer > 0) {
                    io.to(room).emit('timer', rooms[room].timer)
                    rooms[room].timer--;
                }
                else {
                    console.log('match started');
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
                            console.log('match ended');
                            io.to(room).emit('matchend');
                            clearInterval(MatchCountdown);
                        }
                        if (rooms[room].matchTimer > 0) {
                            io.to(room).emit('Matchtimer', rooms[room].matchTimer)
                            rooms[room].matchTimer--;
                        }
                        else {
                            console.log('match ended');
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
    socket.on('getTimeLeft', (room, fn) => {
        fn(rooms[room].matchTimer)
    })
    socket.on('progress', (progress, room) => {
        console.log('in progress')
        rooms[room].users[socket.id].progress = progress;
        setPosition(rooms[room].users);
        // console.log(rooms[room].users);
        io.to(room).emit('progressBroadcast', rooms[room].users, socket.id);

    });

    socket.on('disconnect', () => {
        let room;
        console.log(`${socket.id} disconnected`);
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


//Middelware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cors());
app.use(express.static("public"));
app.set('view engine', 'ejs');


app.use(session({
    secret: 's3cr3tT0k3n',
    saveUninitialized: true,
    resave: false
}));


//home route
app.get('/', (req, res) => {
    res.render('pages/index');
});

app.get('/signup', (req, res) => {
    res.render('pages/signup');
})

app.get('/login', (req, res) => {
    res.render('pages/login');
})

app.get('/about', (req, res) => {
    res.render('pages/about');
})
app.get('/create', (req, res) => {
    let user = req.session.user;
    // console.log(user);
    if (!user) {

        return res.render('pages/create');
    }
    return res.render('pages/race')
})

app.get('/practice', async (req, res) => {
    // GET request to the API endpoint using the fetch.
    // apiList = [`https://free-quotes-api.herokuapp.com/`, `https://animechan.vercel.app/api/random`, `https://programming-quotes-api.herokuapp.com/Quotes/random`, `https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw&type=single`];
    // Did not include the above list because the structure of the json file is different and have to figure it out.
    apiList = [`https://free-quotes-api.herokuapp.com/`];
    const apiURL = apiList[Math.floor(Math.random() * apiList.length)];
    try {
        await fetch(apiURL)
            .then(res => res.json())
            .then(data => {
                const para = data.quote;
                res.render('pages/practice', {
                    para
                })
            });
    } catch (err) {
        console.log(err);
    }
})



app.get('/race', async (req, res) => {
    return res.render('pages/create');

})

// app.post('/join', (req, res) => {
//     const username = req.body.user_name;
//     const roomname = req.body.room_name;
//     res.redirect(`/${roomname}/${req.body.user_name}`)
// })


app.post('/race', async (req, res) => {
    const username = req.body.user_name;
    const roomname = req.body.room_name;
    if (roomname) {
        res.redirect(`/${roomname}/${req.body.user_name}`)
    } else {
        let id = makeid()
        rooms[id] = { users: {} }
        res.redirect(`/${id}/${username}`)
    }
})

app.get('/:room/:name', async (req, res) => {
    if (rooms[req.params.room] == null) {
        return res.redirect('/')
    }
    // console.log(data);
    if (!rooms[req.params.room].data) {
        apiList = [`https://free-quotes-api.herokuapp.com/`];
        const apiURL = apiList[Math.floor(Math.random() * apiList.length)];
        try {
            await fetch(apiURL)
                .then(res => res.json())
                .then(data => {
                    const quote_string = data.quote;
                    rooms[req.params.room].data = quote_string;
                    // console.log(rooms[req.params.room])
                    return res.render('pages/race', {
                        para: quote_string,
                        roomId: req.params.room,
                        username: req.params.name
                    })
                });
        } catch (err) {
            console.log(err);
        }
    } else {
        return res.render('pages/race', {
            para: rooms[req.params.room].data,
            roomId: req.params.room,
            username: req.params.name
        })
    }

})
//start server
http.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});