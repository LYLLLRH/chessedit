var express = require("express");
var router = express.Router();
var fs = require('fs');
var pgn = require('../lib/pgnweb');
var Chess = require('../lib/chess').Chess;
var chess = new Chess();
var cache = {cw1:'',cw2:''};

router.get('/h/:id',function  (req,res) {
	var moves;
	console.log('req,params:' + req.params.id);
	fs.exists('./pgndb/'+req.params.id,function(ex){
		if (!ex) { res.end("没有对应棋谱")}
	    else {
			var html = '';
			if (cache.cw1=='') { 
				fs.readFile('cw1.tpl','utf-8',function(err,data){
					if (err) throw err;
					cache.cw1=data;
					fs.readFile('cw2.tpl','utf-8',function(err,data){	
						if (err) throw err;	
						cache.cw2=data;
						fs.readFile('./pgndb/'+req.params.id,'utf-8',function(err,data){
							if (err) throw err;
							var pgninfo = JSON.parse(data);
							var moves = pgnParse(pgninfo.pgn);
							if (pgninfo.gameplay == '') { pgninfo.gameplay ='White vs Black'; }
							objAddFens(moves,"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
							objAddOids(moves);
							html = cache.cw1 + ' var gameplay = "' + pgninfo.gameplay +'";';
							html += ' var gameinfo = "' + pgninfo.gameinfo +'";';
							html += " var movesJSON = '" + JSON.stringify(moves) + "';";
							html += cache.cw2;
							res.end(html);
						});	
					});
				});	
			} else {
				fs.readFile('./pgndb/'+req.params.id,'utf-8',function(err,data){
					if (err) throw err;
					var pgninfo = JSON.parse(data);
					var moves = pgnParse(pgninfo.pgn);
					// console.log(moves);
					if (pgninfo.gameplay == '') { pgninfo.gameplay ='White vs Black'; }
					objAddFens(moves,"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
					objAddOids(moves);
					html = cache.cw1 + ' var gameplay = "' + pgninfo.gameplay +'";';
					html += ' var gameinfo = "' + pgninfo.gameinfo +'";';
					html += " var movesJSON = '" + JSON.stringify(moves) + "';";
					html += cache.cw2;
					res.end(html);
				});		


			}
		}	
	});
});	

function pgnParse(pgnString) {

	console.log(pgn.parse(pgnString));
	return pgn.parse(pgnString).movetext.moves;
}

function objAddFens(moves, fen) {
    for (var i = 0; i < moves.length; i++) {
        if (moves[i].rav) {
            var temp = moves[i].rav;
            for (var j = 0; j < temp.length; j++) {
                objAddFens(moves[i].rav[j], fen);
            }
         }   

		chess.load(fen);
		var san = moves[i].san.split(" ")[0];
		chess.move(san);
		moves[i].fen = chess.fen();
		var mm = chess.history({verbose:true}).pop();
		moves[i].mm = {'from':mm.from || '','to':mm.to || ''};       
        fen = moves[i].fen;
    }
}

function objAddOids(moves, oidStr) {
    var oid = oidStr || "";
    for (var i = 0; i < moves.length; i++) {
        if (moves[i].rav) {
            var temp = moves[i].rav;
            for (var j = 0; j < temp.length; j++) {
                objAddOids(moves[i].rav[j], oid + "" + (i + 1) + "-" + (j + 1) + "-");
            }
        }
        moves[i].oid = oid + (i + 1);
    }
}


module.exports = router;