const jwt = require('jsonwebtoken');
const requireAuth = (req, res, next) => {
    const token = req.cookies.typio_access_token;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                res.locals.username = null;
                res.redirect('/login');
            } else {
                res.locals.username = decodedToken.username;
                next();
            }
        })
    } else {
        res.locals.username = null;
        res.redirect('/login');
    }
}

const checkUser = (req, res, next) => {
    const token = req.cookies.typio_access_token;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                res.locals.username = null
                next();
            } else {
                res.locals.username = decodedToken.username;
                res.redirect('/')
            }
        })
    } else {
        res.locals.username = null;
        next();
    }
}



module.exports = { requireAuth, checkUser }