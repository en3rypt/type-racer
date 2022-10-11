const race = require('express').Router();
const makeid = require('../utils/makeid');
const rooms = require('../utils/rooms');
race.get('/', (req, res) => {
    return res.render('pages/create');
})

race.post('/', async (req, res) => {
    const username = req.body.user_name;
    const roomname = req.body.room_name;
    if (roomname) {
        res.redirect(`room/${roomname}/${req.body.user_name}`)
    } else {
        let id = makeid()
        rooms[id] = { users: {} }
        res.redirect(`room/${id}/${username}`)
    }
})


module.exports = race;