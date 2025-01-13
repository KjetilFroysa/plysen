const express = require('express');
const router = express.Router();
const ullObjekter = require('../models/objects/ull.js');

router.get('/data/ullObjekter', (req, res) => {
    res.json(ullObjekter);
});

module.exports = router;