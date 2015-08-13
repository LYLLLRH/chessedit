
var express = require("express");
var router = express.Router();
var path = require('path');
var fs = require('fs');

router.get('/pgn/list/:user/',function  (req,res) {
	//now only support default user admin, so all the pgn file is stored in pgndb dir
	//other user's pgn can be stored in associated pgndb/[user] dir;
	// get list , now is the total list
	var user = '';

	fs.readdir('pgndb',function( err,data) {
		if (err) throw err;
		console.log(JSON.stringify(data));
		res.end(JSON.stringify(data));
	})

});


module.exports = router;