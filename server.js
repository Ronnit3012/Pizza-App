const express = require('express');
const app = express();
const path = require('path');

const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');

const PORT = process.env.PORT || 5000;

// Set Template Engine
// app.use(expressLayout);
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('home');
})

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});