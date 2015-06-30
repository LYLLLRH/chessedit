var express = require("express");
var router = express.Router();

router.post('/pgn/add',function  (req,res) {

	console.log(req.body);
	res.end("http://www.lychess.net/html/2015063001");
});


module.exports = router;