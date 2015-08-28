var express = require("express");
var router = express.Router();
var fs = require('fs');

router.get('/p/:id',function  (req,res) {

		console.log(req.params.id);
		// fs.exists('./pgndb/'+req.params.id,function(ex){
			// if (!ex) { res.end("没有对应棋谱")}
		    // else {
		    	console.log('puzzle');
		    	// conosle.log('')
				fs.readFile('./puzzlewidget.html','utf-8',function(err,data){
					if (err) throw err;
					res.end(data);	
				});

			// }
		// })	
});


module.exports = router;