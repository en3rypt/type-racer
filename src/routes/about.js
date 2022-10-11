const about = require('express').Router();
const fetch = require('node-fetch');

about.get('/', async (req, res) => {
    const en3ryptBio = `https://api.github.com/users/en3rypt`;
    const jassuwuBio = `https://api.github.com/users/jassuwu`;
    const eb = await fetch(en3ryptBio).then(response => response.json());
    const jb = await fetch(jassuwuBio).then(response => response.json());
    res.render('pages/about', { jassuwu_status: jb.bio, en3rypt_status: eb.bio });
})

module.exports = about;