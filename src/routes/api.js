var express = require('express');
var router = express.Router();

var FeedProvider = require('../models/FeedProvider');

/* GET home page. */
router.get('/feeds', function(req, res, next) {
  console.log('got the request!');
  FeedProvider.find(function(err, providers) {
    if (err) {
      console.log(err);
      res.send(err);
    }

    res.send(providers);
  });

});

module.exports = router;
