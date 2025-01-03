const createError = require('http-errors');
const express = require('express');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');


const indexRouter = require('./routes/index');
const ullLagerRouter = require('./routes/ullLager');
const kalkulatorRouter = require('./routes/kalkulator');

const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));



// Route to handle form submission
app.post('/submit-order', (req, res) => {
  const order = req.body;

  // Read existing orders from the JSON file
  const filePath = path.join(__dirname, 'data/ordrerBestilling.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
          console.error('Error reading orders file:', err);
          return res.status(500).send('Internal Server Error');
      }

      const orders = JSON.parse(data);
      orders.orders.push(order);

      // Write updated orders back to the JSON file
      fs.writeFile(filePath, JSON.stringify(orders, null, 2), (err) => {
          if (err) {
              console.error('Error writing orders file:', err);
              return res.status(500).send('Internal Server Error');
          }

          res.send('Order submitted successfully');
      });
  });
});

// Route to handle marking an order as done
app.post('/mark-as-done', (req, res) => {
  const { partiNummer } = req.body;

  const bestillingPath = path.join(__dirname, 'data/ordrerBestilling.json');
  const ferdigPath = path.join(__dirname, 'data/ordrerFerdig.json');

  fs.readFile(bestillingPath, 'utf8', (err, bestillingData) => {
      if (err) {
          console.error('Error reading bestilling file:', err);
          return res.status(500).send({ success: false, message: 'Internal Server Error' });
      }

      const bestillingOrders = JSON.parse(bestillingData);
      const orderIndex = bestillingOrders.orders.findIndex(order => order.partiNummer === partiNummer);

      if (orderIndex === -1) {
          return res.status(404).send({ success: false, message: 'Order not found' });
      }

      const [order] = bestillingOrders.orders.splice(orderIndex, 1);

      fs.readFile(ferdigPath, 'utf8', (err, ferdigData) => {
          if (err) {
              console.error('Error reading ferdig file:', err);
              return res.status(500).send({ success: false, message: 'Internal Server Error' });
          }

          const ferdigOrders = JSON.parse(ferdigData);
          const year = new Date(order.dato).getFullYear();
          let yearOrders = ferdigOrders.find(y => y.år === year);

          if (!yearOrders) {
              yearOrders = { år: year, ordrer: [] };
              ferdigOrders.push(yearOrders);
          }

          yearOrders.ordrer.push(order);

          fs.writeFile(bestillingPath, JSON.stringify(bestillingOrders, null, 2), (err) => {
              if (err) {
                  console.error('Error writing bestilling file:', err);
                  return res.status(500).send({ success: false, message: 'Internal Server Error' });
              }

              fs.writeFile(ferdigPath, JSON.stringify(ferdigOrders, null, 2), (err) => {
                  if (err) {
                      console.error('Error writing ferdig file:', err);
                      return res.status(500).send({ success: false, message: 'Internal Server Error' });
                  }

                  res.send({ success: true });
              });
          });
      });
  });
});

// Route to serve the form page
app.get('/lagOrdre', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/html/lagOrdre.html'));
});

// Se bestillinger
app.get('/ordrerBestilling', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/html/ordrerBestilling.html'));
});

// Se bestillinger
app.get('/ordrerFerdig', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/html/ordrerFerdig.html'));
});



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

app.get('/data/råvareLager', (req, res) => {
  const filePath = path.join(__dirname, 'data/råvareLager.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
          res.status(500).send('Error reading råvareLager file');
          return;
      }
      res.json(JSON.parse(data));
  });
});

app.get('/data/ordrerBestilling', (req, res) => {
  const filePath = path.join(__dirname, 'data/ordrerBestilling.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
          res.status(500).send('Error reading ordrerBestilling file');
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
