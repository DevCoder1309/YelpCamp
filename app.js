if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}

// mongodb+srv://mukherjeeankit370:<password>@cluster0.gkvhuya.mongodb.net/?retryWrites=true&w=majority

const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/yelp-camp";

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const AppError = require('./utils/ExpressError');
const session = require('express-session')
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user')
const userRoutes = require('./routes/users')
const mongoSanitize = require("express-mongo-sanitize");
const app = express();
const helmet = require('helmet')

const methodOverride = require('method-override')
const ejsMate = require('ejs-mate');
const router = require('./routes/campgrounds')
const reviews = require('./routes/reviews')
app.use(express.static(path.join(__dirname, "public")));
app.use(mongoSanitize())
// app.use(helmet({ contentSecurityPolicy: false}));
const MongoDBStore = require("connect-mongo")(session);

const store = new MongoDBStore({
  url: dbUrl,
  secret: "thisshouldbeabettersecret",
  touchAfter: 24 * 60 * 60
});

store.on("error", function(e){
    console.log(e)
})
const secretConfig = {
    store,
    secret: "thisshouldbeabettersecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};


app.use(flash())
app.use(session(secretConfig));


// creating passport for authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
})


app.engine('ejs', ejsMate);
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

mongoose.connect(dbUrl).then(()=>{console.log('MONGODB CONNECTED')}).catch((err)=>{console.log("OH NO! ERROR", err)})


// defining server side validation for reviews using JOI like validatecampground function:



app.use('/campgrounds', router)

app.use('/campgrounds', reviews)

app.use("/", userRoutes);

app.get('/', (req, res) => {
    res.render('home.ejs');
})


app.use(helmet());

const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
];
const connectSrcUrls = [
  "https://api.mapbox.com/",
  "https://a.tiles.mapbox.com/",
  "https://b.tiles.mapbox.com/",
  "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/dgicslzpc/",
        "https://images.unsplash.com/",
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);


//here is the error handling middleware and when next() is called it calls the below middleware to handle the error:

app.all('*', (req, res, next) => {
    next(new AppError('PAGE NOT FOUND', 404))
})

app.use((err, req, res, next) => {
    const {status= 500, message = "sorry something went wrong"} = err;
    res.status(status).render('error.ejs', {message});
})


app.listen(3000, () => {
    console.log('listening on Server 3000..........');
})

// module.exports = router;