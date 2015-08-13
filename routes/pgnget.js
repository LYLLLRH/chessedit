var express = require("express");
var router = express.Router();
var fs = require('fs');

router.get('/s/:id',function  (req,res) {

		console.log(req.params.id);
		fs.exists('./pgndb/'+req.params.id,function(ex){
			if (!ex) { res.end("没有对应棋谱")}
		    else {
				fs.readFile('./pgndb/'+req.params.id,'utf-8',function(err,data){
					if (err) throw err;
					res.end(data);	
				});

			}
		})	
});


module.exports = router;