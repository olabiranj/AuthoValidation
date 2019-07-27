let createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let mongoose = require('mongoose');
let methodOverride = require('method-override');
let session = require("express-session");
let passport = require('passport');
let MongoStore = require('connect-mongodb-session')(session);
let flash = require("express-flash");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
require("./config/passport");

var app = express();

let db = "mongodb://localhost:27017/authoApp";
mongoose.Promise = global.Promise;
mongoose.connect(db, { useNewUrlParser: true, useCreateIndex: true });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('mysecret'));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    name: "autho_session",
    secret: "mysecret",
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
        uri: db,
        databaseName: 'authoApp',
        collection: 'app_sessions'
    })
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());



app.use('/', indexRouter);
app.use('/users', usersRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
