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

router.get('/api/fetch-data', function(req, res, next) {
  const sessionid = req.query.session
  res.send("ok");
});

module.exports = router;
