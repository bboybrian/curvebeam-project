var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const sql = require('mssql')
require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const PORT = process.env.PORT || 8080;
console.log("Port:",PORT);

// connect to sql
const config = {
    authentication: {
      options: {
        userName: process.env.DB_USER,
        password: process.env.DB_PWD
      },
      type: "default"
    },
    server: process.env.DB_SERVER,
    options: {
      database: process.env.DB_NAME,
      encrypt: true
    }
};

// create a 'pool' (group) of connections to be used for connecting with our SQL server
// const dbConnectionPool = new Connection(config);
const dbConnectionPool = new sql.ConnectionPool(config)
  .connect()
  .then (pool =>{
      console.log("connected")
      return pool
  })
  .catch(err => console.log("failed to connect", err)); 

var app = express();

app.use(express.static(path.join(__dirname, 'client/build'))); // this is where your built react js files are

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Enabled headers
app.use(function (req, res, next) {
  console.log(req,res);
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Set allowed server methods
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Set access control headers
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  // Set allowed cookies
  res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  next();
});

app.use(function(req, res, next) {
  req.pool = dbConnectionPool;
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('*', (req, res) => res.sendFile(path.join(__dirname, 'client/build', 'index.html')));

// if (process.env.NODE_ENV === 'production') {
  // Exprees will serve up production assets
  // app.use(express.static('client/build'));

  // // Express serve up index.html file if it doesn't recognize route
  // const path = require('path');
  // app.get('*', (req, res) => {
  //   res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  // });
// }

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
// app.listen(0.0.0.0)

module.exports = app;
