//npm modules
const express = require('express');
const app = express();
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const session = require('express-session');
const { requireAuth, checkUser } = require('./src/middleware/auth');
//Environment variables
require('dotenv').config();

// Static variables
const PORT = process.env.PORT || 3000

// Route modules
const about = require('./src/routes/about');
const signup = require('./src/routes/signup');
const login = require('./src/routes/login');
const create = require('./src/routes/create');
const practice = require('./src/routes/practice');
const race = require('./src/routes/race');
const room = require('./src/routes/room');
const profile = require('./src/routes/profile');
const logout = require('./src/routes/logout');

//socket connection
require('./src/utils/sockets')(io);

//Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(cookieParser());



//Routing
// app.get('*', checkUser);
app.get('/', requireAuth, (req, res) => { res.render('pages/index'); });
app.use('/signup', checkUser, signup);
app.use('/login', checkUser, login);
app.use('/logout', requireAuth, logout);
app.use('/about', requireAuth, about);
app.use('/create', requireAuth, create);
app.use('/practice', requireAuth, practice);
app.use('/race', requireAuth, race)
app.use('/room', requireAuth, room)
app.use('/profile', requireAuth, profile);
app.use('/logout', requireAuth, logout);
app.get('*', (req, res) => { res.status(404).render('pages/404'); });


//Listen on the port
http.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});


