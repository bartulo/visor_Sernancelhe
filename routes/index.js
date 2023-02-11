var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('visor/visor.hbs');
});

module.exports = router;
