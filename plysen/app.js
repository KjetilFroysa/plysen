const createError = require('http-errors');
const express = require('express');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const ullLagerRouter = require('./routes/ullLager');
const kalkulatorRouter = require('./routes/kalkulator');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

app.get('/data/recipes', (req, res) => {
  const recipesPath = path.join(__dirname, '/data/recipes.json');
  fs.readFile(recipesPath, 'utf8', (err, data) => {
      if (err) {
          res.status(500).send('Error reading recipes file');
          return;
      }
      res.json(JSON.parse(data));
  });
});

app.get('/data/ullLager', (req, res) => {
  const recipesPath = path.join(__dirname, '/data/ullLager.json');
  fs.readFile(recipesPath, 'utf8', (err, data) => {
      if (err) {
          res.status(500).send('Error reading recipes file');
          return;
      }
      res.json(JSON.parse(data));
  });
});

app.use('/', indexRouter);
app.use('/ullLager', ullLagerRouter);
app.use('/kalkulator', kalkulatorRouter);


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
