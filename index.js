const express = require('express');
const app = express();
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const cors = require('cors');
const PORT = process.env.PORT || 3000
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fetch = require('node-fetch');






// const cors = require('cors')



//scoket connection
io.on('connection', (socket) => {
    console.log(socket.id);
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('progress', (data) => {
        console.log(data);
    });
    socket.on("hello", (arg) => {
        console.log(arg); // world
    });
});


//Middelware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public"));
app.set('view engine', 'ejs');


//home route
app.get('/', (req, res) => {
    res.render('pages/index');
});

app.get('/about', (req, res) => {
    res.render('pages/about');
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
    apiList = [`https://free-quotes-api.herokuapp.com/`];
    const apiURL = apiList[Math.floor(Math.random() * apiList.length)];
    try {
        await fetch(apiURL)
            .then(res => res.json())
            .then(data => {
                const para = data.quote;
                res.render('pages/race', {
                    para
                })
            });
    } catch (err) {
        console.log(err);
    }
    //res.render('pages/race')
})
//start server
http.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});