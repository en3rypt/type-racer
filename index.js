//npm modules
const express = require('express');
const app = express();
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');

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


//socket connection
require('./src/utils/sockets')(io);

//Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: false
}));


//Routing
app.get('/', (req, res) => { res.render('pages/index'); });
app.use('/signup', signup);
app.use('/login', login);
app.use('/about', about);
app.use('/create', create);
app.use('/practice', practice);
app.use('/race', race)
app.use('/room', room)
app.get('*', (req, res) => { res.status(404).render('pages/404'); });


//Listen on the port
http.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});


