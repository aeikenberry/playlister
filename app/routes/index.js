var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {redirectUri = process.env.REDIRECT_URI || 'http://localhost:8000/app/'});
});

module.exports = router;
