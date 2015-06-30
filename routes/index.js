var express = require('express');
var fs = require('fs');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  fs.readFile("chessedit.html","utf-8",function  (err,data) {
  	if (err) throw err;
  	res.writeHead(200,{ "Content-Type": "text/html" });
  	res.end(data);
  	// body...
  })
});

module.exports = router;
