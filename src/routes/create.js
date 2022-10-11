const create = require('express').Router();
const fetch = require('node-fetch');

create.get('/', (req, res) => {
    let user = req.session.user;
    // console.log(user);
    if (!user) {

        return res.render('pages/create');
    }
    return res.render('pages/race')
})

module.exports = create;