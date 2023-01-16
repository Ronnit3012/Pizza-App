require('dotenv').config();
const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const expressLayout = require('express-ejs-layouts');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
const MongoDbStore = require('connect-mongo');
const passport = require('passport');
const socket = require('socket.io');
const Emitter = require('events');

const PORT = process.env.PORT || 5000;

// Database Connection
mongoose.set("strictQuery", false);

mongoose.connect(process.env.MONGO_CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database Connected...');
}).on('error', err => {
    console.log('Connection failed...');
});


// Event Emitter
const eventEmitter = new Emitter();         // we create the instance of the inbuilt module of nodejs 'events'
app.set('eventEmitter', eventEmitter);      // we bind the instance with the app so that we can use it everywhere
eventEmitter.setMaxListeners(100);

//Session config
// express-session acts as a middleware
// Session cannot work with the cookies
// Our session is valid till the time our cookie is alive
app.use(session({
    secret: process.env.COOKIE_SECRET,          // To specify encrytion and decryption key for cookies
    resave: false,
    saveUninitialized: false,
    store: MongoDbStore.create({            // Session Store
        mongoUrl: process.env.MONGO_CONNECTION_URL,
        collectionName: 'sessions',
    }),             // This will create a collection in pizza db and store all the sessions of clients and will be deleted from db once the dedicated session expires
    cookie: { maxAge: 1000 * 60 * 60 * 24 },    // this specifies the life of out cookie. The maxAge is calculated in milliseconds.
    // This states that the cookie that will be generated for a session it will have its life of 24 hours
}));

// Passport config
const passportInit = require('./app/config/passport');
passportInit(passport)          // passing the instance of the passport
app.use(passport.initialize());
app.use(passport.session());            // passport works with the help of session


// Flash
app.use(flash());

// Assets
app.use(express.static('public'));

// Now since express does not know in what form we will be receiving data so we need to tell express explicitly to parse if we get these kind of data. Either in the URL encoded form or JSON form.
app.use(express.urlencoded({ extended: false }));   // this tells express to parse the URL encoded data if received    
app.use(express.json());        // this tells express to allow request payload to be read in json

//Global Middelware
app.use((req, res, next) => {       // this will get called before every request
    // console.log(req.session);
    res.locals.session = req.session;       // setting our session
    res.locals.user = req.user;
    // res.locals.userRole = req.session.userRole;
    // console.log(res.locals.session)
    next();
})

// Set Template Engine
app.use(expressLayout);     // this finds the layout page and applies that on all the pages
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');          // setting the view engine as ejs

// Routes
// Routes should always come after the set the templating engines
require('./routes/web')(app);   // passing the instance of express to the route folder

// Error page
app.get('/*', (req, res) => {
    return res.status(404).render('errors/404');
});

const server = app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});


// Socket
const io = socket(server, {
    cors: {
        origin: '*',
    },
});

io.sockets.on('connection', (socket) => {
    // console.log(socket.id);
    
    // Updating Cart
    // eventEmitter.on('cartUpdated', (data) => {
    //     socket.emit('cartUpdated', data);
    // });

    // Join Room
    socket.on('join', (roomName) => {
        socket.join(roomName);      // creating room for the client
    });
});

eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated', data);
});

eventEmitter.on('orderPlaced', (data) => {
    console.log(data);
    io.to('adminRoom').emit('orderPlaced', data);
});