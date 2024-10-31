// cd web/udemy/newStudy/helpCamp

// Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env.
// we only wanna get the info out of .env as long as we are in development mode
// in our app we will now has access to .env variables
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

// npm install cloudinary@1.41.3
// npm install multer-storage-cloudinary@4.0.0
// npm install multer@1.4.5-lts.1

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const helmet = require('helmet');

// configuring passport
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');

// this package allows us to share functionalities btw our templates efficiently. basically its one of the many engine used to run or parse ejs.
const ejsMate = require('ejs-mate');

const expressError = require('./utils/expressError')

// including routers
const campgroundsRouter = require('./routes/campgrounds');
const reviewsRouter = require('./routes/reviews');
const usersRouter = require('./routes/users');

const mongoSanitize = require('express-mongo-sanitize')

const dbUrl = 'mongodb://127.0.0.1:27017/help-camp';
mongoose.connect(dbUrl);
// const dbUrl = process.env.DB_URL
// mongoose.connect(dbUrl)

// connection object on mongoose and db is just a refernce variable
// db.on is an event handle for error event and c.l.bind binds console object to connection error string
// db.once to handle conncection open event
const db = mongoose.connection;
db.on('error', console.log.bind(console, 'connection error'));
db.once('open', () => {
    console.log('database is online');
});

const app = express();
// telling express to use this engine. Now can make layouts in our views dir
app.engine('ejs', ejsMate);

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(mongoSanitize())

// adding in mongo store for sessions
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});

// adding in session so that we could setup auth and flashes.
const sessionConfig = {
    store,
    name: 'helpToken',
    // The HttpOnly flag (optional) is included in the HTTP response header, the cookie cannot be accessed through client side script (again if the browser supports this flag). As a result, even if a cross-site scripting (XSS) flaw exists, and a user accidentally accesses a link that exploits this flaw, the browser (primarily Internet Explorer) will not reveal the cookie to a third party.
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure : true, cookies can only be accessed over https
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7 //converting week into milliseconds because date.now() is in milliseconds
        ,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
    // we will eventually use mongo store
}
app.use(session(sessionConfig));
app.use(flash());

// common security vulnerabilities handled using helmet
app.use(helmet())
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/",
];
const connectSrcUrls = [
    "https://api.maptiler.com/",
];
const fontSrcUrls = [
    "https://fonts.googleapis.com/",
];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/doehrt7uk/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
                "https://images.unsplash.com",
                "https://api.maptiler.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


// required to initialize passport and passport session middleware is used if our app uses persistent login sessions. alternative will be if logging in for every request but we dont need that.
// also use session( ) before passport.session() to ensure that login session is restored in correct order
app.use(passport.initialize());
app.use(passport.session());
// we tell passport to use local strategy we downloaded and the authentication method for our local strategy is going to located on our user model called authenticate(). refer docs for all static methods added via passport-local-mongoose
passport.use(new localStrategy(User.authenticate()))

// this tells passport how to serialize a user i.e store a user in a session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// setting flash middleware to have access to it on every template as a local variable under the key success and error.
app.use((req, res, next) => {
    // this user property is put on req object by passport after someone is authenticated and it is stored on the session and when we access it,req.user containes  deserialized information from session, this is done by passport and fills it in the request.user. Session stores  serialized information of user.
    // this req.user contains information about user like username and email etc. which will be used when we need to associate a user with a campground.

    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// serving static assets
app.use(express.static(path.join(__dirname, 'public')))


//routers
app.use('/', usersRouter);
app.use('/campgrounds', campgroundsRouter);
// need to use mergeparams to have access to id here.
app.use('/campgrounds/:id/reviews', reviewsRouter);

app.get('/', (req, res) => {
    res.render('home');
})

// 404 route
app.all('*', (req, res, next) => {
    next(new expressError('Page not found', 404))
})

// error handler we can add huge logics here based on what error we might anticipate, we render our error template
app.use((err, req, res, next) => {
    const { message = 'Something went Wrong', status = 500 } = err;
    if (!err.message) err.message = 'Something is wrong';
    res.status(status).render('error', { err });
})

app.listen(3000, () => {
    console.log('connected!');
})


