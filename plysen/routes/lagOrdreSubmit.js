const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Route to handle form submission
router.post('/', (req, res) => {
  const order = req.body;

  // Read existing orders from the JSON file
  const filePath = path.join(__dirname, '../data/ordrerBestilling.json');
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

module.exports = router;