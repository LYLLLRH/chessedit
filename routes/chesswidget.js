var express = require("express");
var router = express.Router();
var fs = require('fs');



// var tempCache = '';
// if (!tempCache) {
// 	var tempCache = fs.readFileSync('chessedit.html.tmplate');	
// }
// 1435678930165

router.get('/h/:id',function  (req,res) {
	// check :id 是否存在
//	if (req.params.id.length === 10 && fs.exist('/pngdb/' + req.params.id)) {
		console.log(req.params.id);
		fs.exists('./pgndb/'+req.params.id,function(ex){
			if (!ex) { res.end("没有对应棋谱")}
		    else {
			var html = '';
			fs.readFile('cw1.tpl','utf-8',function(err,data){
				if (err) throw err;
				html = data;
				fs.readFile('./pgndb/'+req.params.id,'utf-8',function(err,data){
					if (err) throw err;
					html += "var game= " + data + ";";
					fs.readFile('cw2.tpl','utf-8',function(err,data){
						if (err) throw err;
						res.writeHead(200,{"Content-type":"text/html"});
						res.end(html+data);	
					})
				});	

				});

			}
		})	
});


module.exports = router;