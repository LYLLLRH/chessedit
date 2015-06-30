// var express = require("express");
// var router = express.Router();

// router.post('/pgn/add',function(req,res) {
// 	console.log(req.body);
// 	res.end("http://www.lychess.net/html/2015063001");
// });


// module.export = router;

var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.post('/pgn/add',function (req,res) {
  
  var fileName = Date.now();
  var data = JSON.stringify(req.body);
  console.log(data);
  fs.writeFile('./pgndb/'+fileName,data,function(err){
  	if (err) { 
  		res.end('Error Uploding');
 		throw err; 	
  	} else {
  	res.end('http://www.lychess.net/h/' + fileName );
  	}
  }) 
  
});

module.exports = router;
