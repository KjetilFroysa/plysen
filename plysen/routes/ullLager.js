const express = require('express');
const router = express.Router();

/* GET ull lager page. */
router.get('/', function(req, res, next) {
  res.render('ullLager');
});

module.exports = router;