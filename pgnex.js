//a standard chessboard pre-requirement (jquery,chess.js/chessboard.js/pgnexeansion.js)

cbEx = function () {

}

// load a standard png;
// load a expansion pgn with comments, rav, nag and etc;
// load a puzzle ;
// load a exercis;

cbEx.prototype.setCB = function(divID,cfg) {
	this.board = ChessBoard(divID,cfg || 'start');
	this.jboard = $(divID);	
			
};

cbEx.prototype.loadPgn = function(pgnString) {
	this.pgn = pngString;
	this.pgnObj = pngParse(pgnString);
	this.moves = this.pgnObj.movetext.moves;
	if (this.pgnObj.tagPairs.FEN) {
		this.board.position(this.pgnObj.tagPairs.FEN,true);
	}
	this.cursorCur =[0];	
};

