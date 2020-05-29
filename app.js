var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var session = require('express-session');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// Sessions
app.use(session({
  secret:'motherfucker',
  resave: true,
  saveUninitialized: false
}))

app.use((req,res,next) => {
  res.locals.currentUser = req.session.userId;
})

//Connecting mongoose to the databse
mongoose.connect('mongodb://localhost/cuisine', { useNewUrlParser: true, useUnifiedTopology: true });
let db = mongoose.connection;

//Check connection
db.once('open', () => console.log('Connected to MongoDB'))

//Check for database errors
db.on('error', (err) => console.log(err));

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// serve static files from /public
app.use(express.static(__dirname + '/public'));

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
  res.render('error');
});

module.exports = app;
