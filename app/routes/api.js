var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/feeds', function(req, res, next) {
  res.send({'feeds': [{name: 'test feed'}, {name: 'test feed 2'}]});
});

module.exports = router;
