var express = require("express");
var router = express.Router();
var fs = require('fs');
var cache = {pw1:'',pw2:''};

// starttime = 1440818321333 everyday = 86400000
router.get('/p/:id',function  (req,res) {
	var moves;
	console.log('req,params:' + req.params.id);
	fs.exists('./puzzledb/'+req.params.id,function(ex){
		if (!ex) { res.end("没有对应棋谱")}
	    else {
			var html = '';
			if (cache.pw1=='') { 
				fs.readFile('pw1.tpl','utf-8',function(err,data){
					if (err) throw err;
					cache.pw1=data;
					fs.readFile('pw2.tpl','utf-8',function(err,data){	
						if (err) throw err;	
						cache.pw2=data;
						fs.readFile('./puzzledb/'+req.params.id,'utf-8',function(err,data){
							if (err) throw err;
							// var data1= 
							// console.log(data1);
							html = cache.pw1 + " var data = '" + data.replace(/[\r\n]/g,'') +"';" + cache.pw2;
							res.end(html);
						});	
					});
				});	
			} else {
				fs.readFile('./puzzledb/'+req.params.id,'utf-8',function(err,data){
					if (err) throw err;
							if (err) throw err;
							html = cache.pw1 + " var data = '" + data.replace(/[\r\n]/g,'') +"';" + cache.pw2;
							res.end(html);
						
				});		


			}
		}	
	});
});	

module.exports = router;
