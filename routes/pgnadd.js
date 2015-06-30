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
  	res.end('<iframe width=100% height= 450 src="http://www.lychess.net:3001/h/'+fileName+'" frameborder=0></iframe>');

  	}
  }) 
  
});

module.exports = router;
