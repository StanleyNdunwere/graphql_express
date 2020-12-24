// var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const { mongoConnString } = require("./security")

const { graphqlHTTP } = require("express-graphql")
const schema = require("./schema/schema")

const mongoose = require("mongoose");

const connection = mongoose.connect(mongoConnString);

mongoose.connection.once("open", () => {
  console.log("connected successfully")
})

console.log(connection);

var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const { RequestHeaderFieldsTooLarge } = require('http-errors');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/graphql", graphqlHTTP({
  graphiql: true,
  schema: schema,
}));
app.use('/', indexRouter);
app.use('/users', usersRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  // next(createError(404));
  res.send("Error 404. Not found");
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
