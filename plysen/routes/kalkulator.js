const express = require('express');
const router = express.Router();

/* GET kalkulator page. */
router.get('/', function(req, res, next) {
  res.render('kalkulator');
});

module.exports = router;