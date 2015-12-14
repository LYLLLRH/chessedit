// chessBoard状态
	// 1. Active table， 初始值为Tab1 ＝》PGN；
	// 2. tab1 ,tab2,tab3 保存当前的chessboard的信息；
	// 	cfg,fen,

var a= {"san":"Nc3","fen":"1","mm":{"from":"b1","to":"c3"},"oid":"3-1-1"};

var chess = new Chess();
var pgn = new pgnParse();

;(function  () {
	window['tabBoard'] = {
		active : 0,
		fen: '',
		moves: '',
		gameTag: '',
		cursor:'',
		tab:[{
			'moves':[],
			'gameTag':{},
			'cursor':[0],
			'fen':''
		},{
			'moves':[],
			'gameTag':{},
			'cursor':[0],
			'fen':''
		},{
			'moves':[],
			'gameTag':{},
			'cursor':[0],
			'fen':''
		}]
	};
	window['board'] ='';
	window['cursorCur'] = [0];
	window['moves'] = [];
	window['gameTag'] = {};
	window['$aa'] = $("#chessboardpostion");
//	window['movefirst'] = 1;
	
	
})();

function fenInitial(start){
	//check initial tab;
	$(".tag02").show();
	$(".tag03").show();
	changeBoardTab(tabBoard.active,0);
	tabBoard.active = 0;
    tabBoard.fen = !tabBoard.fen?'start':tabBoard.fen;
   	var cfg = {
        draggable: true,
        position: tabBoard.fen,
        sparePieces: true
    };
    if (board) {board.destroy();}
    board = ChessBoard('chessboardpostion', cfg);
    // Fen = > Initial Status;
    //
};

function pgnInitial(){
	// find board;
	// remove sparepiece; can not drag ,do not show off
	//check initial tab
	//disable 
	
	$(".tag03").hide();
	changeBoardTab(tabBoard.active,1);
	tabBoard.active = 1;
    var cfg = {
        position: tabBoard.fen,
        onDragStart: onPgnDragStart,
        onDrop: onPgnDrop,
        onSnapEnd: onPgnSnapEnd,
        sparePieces: true
    };

    if (board) {board.destroy();}
    board = ChessBoard('chessboardpostion', cfg);
	$(".spare-pieces-7492f").css("opacity",0);
	$(".spare-pieces-7492f").find("img").removeClass("piece-417db");
    
    if (!initialStatus(obj2Pgn(moves))) {
    	$(".txtAreaPgn").text('');
    	board.position('start');
    	chess.load("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    	return false;
    };
	boardRefresh(board,$aa,moves,cursorCur);
	chessRefresh(chess,obj2Fen(moves,cursorCur));
	pgnHilightChange($aa,cursorCur,1);
};


function testInitial() {
	//check initial tab;
	// tabBoard.fen = $("#fenDisplay").val();
	$(".tag02").hide();
	changeBoardTab(tabBoard.active,2);
	tabBoard.active = 2;
	$("#testFen").val(tabBoard.fen);
    var cfg = {
        position: tabBoard.fen,
        onDragStart: onPgnDragStart,
        onDrop: onPgnDrop,
        onSnapEnd: onPgnSnapEnd,
        sparePieces: true 
    };
    if (board) {board.destroy();}
	board = ChessBoard('chessboardpostion', cfg);
	// 
	// if (!initialStatus(obj2Pgn(moves))) {return false};
	chessRefresh(chess,$("#testFen").val());
	$(".txtAreaPgn").text("");
	$(".spare-pieces-7492f").css("opacity",0);
	$(".spare-pieces-7492f").find("img").removeClass("piece-417db");

};

function changeBoardTab (fromTab,toTab) {
	//0-1  恢复1中的所有信息 
	//0-2	2的fen设置为0中的fen，其他的清空；
	//1-0	1的所有信息保存一下；0的fen和board设置为 1的fen，
	//2-0	0的fen和board设置为2的fen
	if (fromTab == 0 && toTab == 0) {
		return;
	} else if (fromTab ==1 ){
		if (cursorCur!='') {
		tabBoard.tab[1].fen = obj2Node(moves,cursorCur).fen || 'start';
		tabBoard.tab[1].moves = moves; moves =[];
		tabBoard.tab[1].gameTag = gameTag;gameTag = {};
		tabBoard.tab[1].cursor = cursorCur; cursorCur = [0];
		tabBoard.fen = 	tabBoard.tab[1].fen;
		}	
		return;
	} else if (fromTab==2){
		if (cursorCur !='') {
		tabBoard.fen = obj2Node(moves,cursorCur).fen || 'start';
		moves = [];
		gameTag = {};
		cursorCur = [0];
		}
		return ;
	} else if (toTab == 1) {
		moves = tabBoard.tab[1].moves;
		cursorCur = tabBoard.tab[1].cursor;
		gameTag = tabBoard.tab[1].gameTag;
		return ;
	} else {
        cfg2Fen(board,$("#fenDisplay"),{
        	'wfm':$('#wfm'),
        	'bfm':$('#bfm'),
        	'wsc':$('#wsc'),
        	'wlc':$('#wlc'),
        	'bsc':$('#bsc'),
        	'blc':$('#blc')
        });
		tabBoard.fen = $("#fenDisplay").val();
		tabBoard.tab[2].fen = tabBoard.fen;
		moves = [];
		gameTag = {};
		cursorCur = [0];
		return;
	}

}

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

    function onPgnDragStart(source, piece, position, orientation) {
        //check tag02 or tag03 是否为active ,或者tag01 active ,但是符合走棋的规则
        if (!checkEnforcLegalMove()) {
            return false;
        }

        if (chess.game_over() === true ||
            (chess.turn() === 'w' && piece.search(/^b/) !== -1) ||
            (chess.turn() === 'b' && piece.search(/^w/) !== -1)) {
            return false;
        }
    };


    function onPgnDrop(source, target) {
        //check tag02 or tag03 是否为active ,或者tag01 active ,但是符合走棋的规则
        if (!checkEnforcLegalMove()) {
            return false;
        }

        // see if the move is legal
        var move = chess.move({
            from: source,
            to: target,
            promotion: $("#promotion").val()
        });

        // illegal move
        if (move === null) return 'snapback';
        updateStatus(move);
    };

    function onPgnSnapEnd() {
        //check tag02 or tag03 是否为active ,或者tag01 active ,但是符合走棋的规则
        if (!checkEnforcLegalMove()) {
            return false;
        }
		boardRefresh(board,$aa,moves,cursorCur);
		pgnHilightChange($aa,cursorCur,1);

	 // updateStatus(move);
    };

    function checkEnforcLegalMove() {
        return !$(".tag01").hasClass("active");
    }

    var updateStatus = function(move) {
        var status = '';
        var moveColor = 'White';
        if (chess.turn() === 'b') {
            moveColor = 'Black';
        }
        // checkmate?
        if (chess.in_checkmate() === true) {
           // console.log('Game over, ' + moveColor + ' is in checkmate.');
			alert("Checkmate!");
        }
        else if (chess.in_draw() === true) {
            console.log('Game over, drawn position');
        }
        else {
            console.log(moveColor + ' to move');
            // check?
            if (chess.in_check() === true) {
                console.log(', ' + moveColor + ' is in check');
            }
        }
       // $(".txtAreaPgn").html(game.pgn());
		if ( (cursor = checkMoveExisting(moves,cursorCur,chess.fen()))) { // the next move is already here so no change happens

			cursorCur = cursor;
			// boardRefresh(board,$aa,moves,cursorCur);
			// pgnHilightChange($aa,cursorCur,1);
		} else {  // new Move, chaneg moves,pgn,html, re-bind the move's click,
			if ( tabBoard.active == 2) {
				cursorCur = objAddNode(moves,cursorCur,move);
				initialStatus(obj2Pgn(moves),tabBoard.fen);
			} else {
				cursorCur = objAddNode(moves,cursorCur,move);
				initialStatus(obj2Pgn(moves));
			}
		    // boardRefresh(board,$aa,moves,cursorCur);
			chessRefresh(chess,obj2Fen(moves,cursorCur));
			// pgnHilightChange($aa,cursorCur,1);
		}

    };

	function checkMoveExisting(moves,cursorCur,fen) {
		// cursorCur is the last move ,return false;
		// else get all next moves direct + rav[0][0] + rav[0][0]  pay attention to judge rav[0][0]'s length;
		var cursor = cursorCur.slice(0);
		if (!(cursorCur = curForward(moves,cursor))) { return false;}
		node = obj2Node(moves,cursorCur);
		if ( node.fen == fen) { return cursorCur;}
		if (node.rav) {
			for (var i=0;i<=node.rav.length-1;i++){
				if (node.rav[i][0].fen == fen) {
					cursorCur.push(i+1,1);
					return cursorCur;
				}
			}
		}
		return false;
	}

// 	function initialStatus(moves,cursorCur,board) {
// 	moves = {};
// 	cursorCur = [];
// 	board.position("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");

// }

	function initialStatus(pgnStr,startFen,load) {
		var fen = '';
		if  ( (!pgnStr.match(/^\s+$/)) && (pgnmove = pgn.parse(pgnStr))  ) {
			moves = pgnmove.movetext.moves;
			gameTag = pgnmove.tagPairs || gameTag;
			if (
				tabBoard.active==2 && gameTag.FEN) {
				fen = gameTag.FEN;

				tabBoard.fen= tabBoard.tab[2].fen=fen;
				$("#testFen").val(fen);

			} else {
				fen = startFen || "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
			}
			
			if (load) {
				if (tabBoard.active == 2) {
					tabBoard.tab[2].gameTag = gameTag;
					tabBoard.tab[2].fen = fen;
				}
			    var cfg = {
			        position: tabBoard.active ==2 ?fen:'start',
			        onDragStart: onPgnDragStart,
			        onDrop: onPgnDrop,
			        onSnapEnd: onPgnSnapEnd,
			        sparePieces: true 
			    };
			    if (board) {board.destroy();}
				board = ChessBoard('chessboardpostion', cfg);
			}

			objAddFens(moves || [],fen ,function (ply,fen) {
				if (!fen) {console.log("fen is empty")}
					else { chess.load(fen)};
				var san = ply.san.split(" ")[0];
				chess.move(san);
				ply.fen = chess.fen();
				var mm = chess.history({verbose:true}).pop();
				ply.mm = {'from':mm.from || '','to':mm.to || ''};
				// console.log(ply.mm);
			});

			objAddOids(moves);
			var movefirst = (tabBoard.active == 2 && tabBoard.fen.match(/\sb\s/));
			var prepend = movefirst?'1...':'';
			
			chess.load(fen);
			$(".txtAreaPgn").html( prepend + obj2Html(moves,movefirst?2:1));
			
			$(".txtAreaPgn a").bind("click",function(e){
				cursorCur = JSON.parse("["+(this.id).replace(/\-/g,",")+"]");
				// console.log("c:before"+cursorCur);
				boardRefresh(board,$aa,moves,cursorCur);
				chessRefresh(chess,obj2Fen(moves,cursorCur));
				pgnHilightChange($aa,cursorCur,1)

			});
			return true;
		} else {
			return false;
		}
	}

	function chessRefresh(chess,fen){
		if (fen== '') {
		} else {chess.load(fen);
		callEngine(chess.fen());
		}
	}

//FEN "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" standard
//FEN "1r4k1/p4p1p/3p2P1/2nPP2P/2N4q/8/BrPR1Q2/K5R1 b - - 0 1"
	function fen2Cfg (fen,cfgObj) {
		var items = fen.val().split(' ');
		if (items.length<6) return false; // not standard fen;
		 //fm : first mover
		 var temp=(items[1]==='w')?cfgObj.wfm.prop('checked',true):cfgObj.bfm.prop('checked',true);
		 var castle = items[2].split('');
	 	cfgObj.wsc.prop('checked',false);
	 	cfgObj.wlc.prop('checked',false);
	 	cfgObj.bsc.prop('checked',false);
	 	cfgObj.blc.prop('checked',false);
		 if (castle[0] != '-') {

		 	for (var i=0;i<castle.length;i++) {
		 		switch (castle[i])  {
		 		case 'K':
		 			cfgObj.wsc.prop('checked',true);
		 			break;
		 		case 'Q':
		 			cfgObj.wlc.prop('checked',true);
		 			break;
		 		case 'k':
		 			cfgObj.bsc.prop('checked',true);
		 			break;
		 		case 'q':
		 			cfgObj.blc.prop('checked',true);
		 		}
		 	}
		 }
	}

	function cfg2Fen (board,fen,cfgObj) {
		var fm = cfgObj.wfm.prop('checked') ? 'w':'b';

		var castle = (cfgObj.wsc.prop('checked')?'K':'') + (cfgObj.wlc.prop('checked')?'Q':'') + (cfgObj.bsc.prop('checked')?'k':'') + (cfgObj.blc.prop('checked')?'q':'');

		fen.val(board.fen()+' '+fm+' '+(castle==''?'-':castle)+' - 0 1');
	}