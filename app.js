var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require("mongoose")
const passport = require("passport");
const session = require('express-session');

const dbUrl = "mongodb+srv://testUser:jMbe6l1aYOFlYN3z@cluster0.tn0kznx.mongodb.net/EduScoreTracker?retryWrites=true&w=majority"

mongoose.connect(dbUrl)
  .then((result) => {
    console.log("Connected Successfully...")
  }) .catch((error) => {
    console.log("Failed to connect to the database: "+error.message)
  });

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(session({
  secret: "random-cat",
  saveUninitialized: false,
  resave: true,
  cookie: { maxAge: 1000 * 60 * 60 * 60 }
}));


app.use(passport.initialize());
app.use(passport.session());
require("./controllers/passport-config")

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('404');
});

module.exports = app;
