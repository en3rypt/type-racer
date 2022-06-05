const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const PORT = 3000;
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

app.get('/practice', (req, res) => {
    res.render('pages/practice');
})

app.get('/race', (req, res) => {
    res.render('pages/race')
})
//start server
app.listen(process.env.PORT || PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});