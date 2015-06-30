var express = require("express");
var router = express.Router();
var fs = require('fs');
var ch = require('/public/js/chess');
var pgnex = require('/public/js/pgnexpansion');
var chess = new ch();


var tempCache = '';
if (!tempCache) {
	var tempCache = fs.readFileSync('chessedit.html.tmplate');	
}

router.get('/h/:id',function  (req,res) {
	// check :id 是否存在
	if (req.params.id.length === 10 && fs.exist('/pngdb/' + req.params.id)) {
		fs.readFile('/pgndb/'+'req.params.id','utf-8',function(err,data){



		});
	}
	//150607#### 编号；
	// 如果存在 ，就生产相应的html文件
	// 然后把文件发出来；
	
	res.end("http://www.lychess.net/html/2015063001");
});


module.exports = router;