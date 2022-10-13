const logout = require('express').Router();

logout.get('/', (req, res) => {
    res.clearCookie('typio_access_token').redirect('/login');
})


module.exports = logout;