const mongoose = require('mongoose');
const path = require('path');
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');
const express = require('express');
const app = express();

const PORT = process.env.PORT || 5000;

// Database Connection
const url = 'mongodb://127.0.0.1:27017/pizza';
mongoose.set("strictQuery", false);

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database Connected...');
}).on('error', err => {
    console.log('Connection failed...');
});


// Assets
app.use(express.static('public'));

// Set Template Engine
app.use(expressLayout);     // this finds the layout page and applies that on all the pages
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');          // setting the view engine as ejs

// Routes
// Routes should always come after the set the templating engines
require('./routes/web')(app);   // passing the instance of express to the route folder

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});