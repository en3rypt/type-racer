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

function setPosition(room, id) {

}


//scoket connection
io.on('connection', (socket) => {


    //new code
    socket.on('new-user', (room, name) => {
        let id = socket.id
        socket.join(room)
        rooms[room].users[socket.id] = { 'name': name, "progress": 0, 'position': 0 }
        console.log(rooms[room].users);
        // io.to(room).broadcast.emit('user-connected', name)
        io.to(room).emit('user-connected', rooms[room].users);
    })

    socket.on('progress', (progress, room) => {
        rooms[room].users[socket.id].progress = progress;
        io.to(room).emit('progressBroadcast', progress, socket.id);
    });

    socket.on('disconnect', () => {
        let room;
        console.log(`${socket.id} disconnected`);
        Object.keys(rooms).forEach(function (room) {
            if (rooms[room].users[socket.id]) {
                delete rooms[room].users[socket.id]
                console.log(rooms);
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

app.get('/about', (req, res) => {
    res.render('pages/about');
})
app.get('/create', (req, res) => {
    let user = req.session.user;
    console.log(user);
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
    let user = req.session.user;
    if (!user) {
        return res.render('pages/create');
    }
    apiList = [`https://free-quotes-api.herokuapp.com/`];
    const apiURL = apiList[Math.floor(Math.random() * apiList.length)];
    try {
        await fetch(apiURL)
            .then(res => res.json())
            .then(data => {
                const para = data.quote;
                return res.render('pages/race', {
                    para: para,
                    id: req.query.id
                })
            });
    } catch (err) {
        console.log(err);
    }
})

app.post('/join', (req, res) => {
    const username = req.body.user_name;
    const roomname = req.body.room_name;
    res.redirect(`/${roomname}/${req.body.user_name}`)
})


app.post('/race', async (req, res) => {
    let id = makeid()
    console.log(req.body.user_name, id)
    rooms[id] = { users: {} }
    res.redirect(`/${id}/${req.body.user_name}`)
})

app.get('/:room/:name', async (req, res) => {
    if (rooms[req.params.room] == null) {
        return res.redirect('/')
    }
    console.log(data);
    if (!rooms[req.params.room].data) {
        apiList = [`https://free-quotes-api.herokuapp.com/`];
        const apiURL = apiList[Math.floor(Math.random() * apiList.length)];
        try {
            await fetch(apiURL)
                .then(res => res.json())
                .then(data => {
                    const quote_string = data.quote;
                    rooms[req.params.room].data = quote_string;
                    console.log(rooms[req.params.room])
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