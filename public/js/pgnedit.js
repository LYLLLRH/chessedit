function pgnInitial(gameboard,game){
	// find board;
	// remove sparepiece; can not drag ,do not show off
	$(".spare-pieces-7492f").css("opacity",0);
	$(".spare-pieces-7492f").find("img").removeClass("piece-417db");
};

function fenInitial(){
	//find board
	//If sparepiece is not display , alert don't change the FEN ,because already PGN
	$(".spare-pieces-7492f").css("opacity",1);
	$(".spare-pieces-7492f").find("img").addClass("piece-417db");
};



function pgnLoad(pgn){
	var game = new Chess();
	game.load_pgn(pgn);
	var moves = game.history();
	var strMoves = '';
	for (var i = 0; i < moves.length; i++) {
		if (i % 2 == 0) {
			strMoves += (i / 2 + 1) + '.';
		}
		strMoves += '<a id="m' + (i + 1) + '">' + moves[i] + ' </a>';
	};
	
	return strMoves;
}

function fensLoad(pgn){
        var game = new Chess();
		game.load_pgn(pgn);
		var fens = [];
        fens.push(game.fen());
        while (game.undo() != null) {
            fens.unshift(game.fen());
        }
        return fens;
}
