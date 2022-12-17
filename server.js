const express = require('express');
const app = express();
const path = require('path');

const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');

const PORT = process.env.PORT || 5000;

// Assets
app.use(express.static('public'));

// Set Template Engine
app.use(expressLayout);     // this finds the layout page and applies that on all the pages
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');          // setting the view engine as ejs

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/login', (req, res) => {
    res.render('auth/login')
});

app.get('/register', (req, res) => {
    res.render('auth/register')
});

app.get('/cart', (req, res) => {
    res.render('customers/cart')
});

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});