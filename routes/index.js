var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.user) {
    res.redirect("/users/dashboard")
  }
  res.render("login");
});

router.get('/test', function(req, res, next) {
  res.render("charts");
});

module.exports = router;
