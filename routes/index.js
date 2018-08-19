let express = require('express');
let router = express.Router();
let request = require('request');
let flickr = require('../api/flickr');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

module.exports = router;