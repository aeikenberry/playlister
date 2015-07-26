var express = require('express');
var router = express.Router();

var FeedProvider = require('../models/FeedProvider');

/* GET home page. */
router.get('/feeds', function(req, res, next) {
  FeedProvider.find(function(err, providers) {
    if (err) {
      res.send(err);
      return;
    }

    res.send({'providers': providers});
  });
});

module.exports = router;
