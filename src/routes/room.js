const room = require('express').Router();
const fetch = require('node-fetch');
const rooms = require('../utils/rooms');

room.get('/:room/:name', async (req, res) => {
    if (rooms[req.params.room] == null) {
        return res.redirect('/')
    }
    // console.log(data);
    if (!rooms[req.params.room].data) {
        apiList = [`http://metaphorpsum.com/paragraphs/1/3?format=json`];
        const apiURL = apiList[Math.floor(Math.random() * apiList.length)];
        try {
            await fetch(apiURL)
                .then(res => res.json())
                .then(data => {
                    const quote_string = data.text;
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

module.exports = room;