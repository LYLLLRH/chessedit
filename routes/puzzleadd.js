var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.post('/puzzle/add',function (req,res) {
  
  var fileName = Date.now();
  var data = req.body.pgn;
  console.log(req.body.pgn);
  fs.writeFile('./puzzledb/'+fileName,data,function(err){
  	if (err) { 
  		res.end('Error Uploding');
 		throw err; 	
  	} else {
  	res.end('<iframe width=100% height= 450 src="http://www.lychess.net:3001/p/'+fileName+'" frameborder=0></iframe>');

  	}
  }) 
  
});

module.exports = router;