var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {


  const resJson = JSON.stringify([
    {
      id: 1,
      name: "tankzorx"
    }
  ])
  res.setHeader('Content-Type', 'application/json');
  setTimeout(() => {
    res.send(resJson);
  }, 1000)
});

module.exports = router;
