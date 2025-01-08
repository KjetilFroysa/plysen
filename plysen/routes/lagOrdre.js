const express = require('express');
const router = express.Router();

/* GET lag ordre page. */
router.get('/', function(req, res, next) {
  res.render('lagOrdre', { title: 'Lag Ordre' });
});

module.exports = router;