			function getGameUser(white,black) {
				var gameinfo ='';
	
				var mateInfo;
				if (/Black/.exec(black)) {
					gameinfo = "黑先走  "; 
					moveFirst = 2;
	
				} else {
					gameinfo = "白先走  ";


				}
				switch (white) {
					case 'Mate in one':  mateInfo='一步杀';break;
					case 'Mate in two':  mateInfo='两步杀';break;
					case 'Mate in three': mateInfo='三步杀';break;
					case 'Mate in four': mateInfo='四步杀';break;
					default: mateInfo='多步杀';break;
				}
				return gameinfo+mateInfo;
				
			}
			var pgnData = pgn.parse(data);
			var gameInfo = getGameUser(pgnData.tagPairs.White,pgnData.tagPairs.Black);
			$("#gameuser").text(gameInfo);
            if (pgnData.tagPairs.Event && pgnData.tagPairs.Date) {
			$("#gameinfo").text (pgnData.tagPairs.Event + ' | ' + pgnData.tagPairs.Date); // 需要在服务器端设置
            } else {$("#gameinfo").text(" ");}
			// if (pgninfo.gameplay == '') { pgninfo.gameplay ='White vs Black'; }
			resolvMoves = pgnData.movetext.moves;
			startFen = pgnData.tagPairs.FEN;
			var cfg = {
				draggable: true,
				position: startFen,
				sparePieces: false,
		        onDragStart: onPgnDragStart,
        		onDrop: onPgnDrop,
        		onSnapEnd: onPgnSnapEnd
			};

			board = new ChessBoard('board', cfg);
			var $aa = $("#board");
			chessEngine.load(startFen);

			objAddFens(resolvMoves,startFen);
			objAddOids(resolvMoves);
  			$(".txtAreaPgn").html('');
			$('#movemsg').text(moveFirst===1?"白方走":"黑方走");


    // PGN Button Action Beign
    $("#pgnEndPosition").click(function(event) {
    	clearTimer();
    	endPosition();
    });
    $("#pgnStartPosition").click(function(event) {
    	clearTimer();
    	startPosition();
    });
    $("#pgnStepForward").click(function(event) {
    	clearTimer();
    	stepFoward();
    });
    $("#pgnStepBackward").click(function(event) {
    	clearTimer();
    	stepBack();
    });

    $("#pgnAutoMove").click(function(event) {
    	if ( autoMove) {
    		clearTimer();}
    		else {autoPlay()};

    	});

    $("#pgnflip").click(function(event) {

    	board.flip();
    	boardRefresh(board,$aa,moves,cursorCur,moves?startFen:null);
    	pgnHilightChange($aa,cursorCur,1);
       
    });

    function stepBack() {
    	var cur;
    	if (!(cur =curBackward(moves,cursorCur)) || cur[0]==0) {
    		cursorCur = [0];
    		pgnHilightChange($aa,cursorCur,0);
    		boardRefresh(board,$aa,moves,[0],startFen);
    		chessEngine.load(startFen);
    		return false;
    	}
    	cursorCur = cur;
    	boardRefresh(board,$aa,moves,cursorCur);
    	pgnHilightChange($aa,cursorCur,1);
    };

    function startPosition() {
    	cursorCur = {};
    	cursorCur = [0];
    	boardRefresh(board,$aa,moves,cursorCur,startFen);
    	pgnHilightChange($aa,cursorCur,0);
    	chessEngine.load(startFen);
    };

    function endPosition() {
    	cursorCur =  {};
    	if (!moves.length) return;
    	cursorCur = [moves.length];    	
    	boardRefresh(board,$aa,moves,cursorCur);
    	pgnHilightChange($aa,cursorCur,1);
    	chessEngine.load(obj2Fen(moves,cursorCur));
    };

    function stepFowardAuto (argument) {
    	if (!moves.length) return;
    	if (!(cur =curForward(moves,cursorCur))) {
    		return false;
    	} else {
    		cursorCur = cur;
    		boardRefresh(board,$aa,moves,cursorCur);
    		pgnHilightChange($aa,cursorCur,1);
    		chessEngine.load(obj2Fen(moves,cursorCur));
    		return true;
    	}
    }
    function stepFoward() {
    	var cur;
    	if (!moves.length) return;
    	if (!(cur =curForward(moves,cursorCur))) {
    		return false;
    	}
    	if ( getMultiMoves(moves,cur).length>1) {
    		$.magnificPopup.open({
    			items: {src: '#moveSelect',
    		},
    		type: 'inline',
    		alignTop: true,
    		fixedContentPos: false,
    		fixedBgPos: true,
    		callbacks: {
    			open: function () {

    				var multiMoves = getMultiMoves(moves,cur);

    				var html = "<ul><li class=\"moveUl selected\" id=\"m1\">1. " + multiMoves[0] + "</li>";
    				for (var i=1;i<multiMoves.length;i++) {
    					html += "<li class=\"moveUl\" id=\"m" + (i+1) +"\">"+(i+1)+". "+ multiMoves[i] +"</li>";
    				}
    				html += "</ul>";
    				$("#movesPop").html(html);
    				$(".moveUl").on("click",function(){
    					$("#movesPop").find(".selected").removeClass("selected");
    					$("#movesPop").find("#m"+this.id.split("m")[1]).addClass("selected");
    				});

    				$(".moveUl").on("click",function(){
    					$("#movesPop").find(".selected").removeClass("selected");
    					$("#movesPop").find("#m"+this.id.split("m")[1]).addClass("selected");
    					$.magnificPopup.close();
    				});
//					}
},
close: function(){
	var num = parseInt($("#movesPop").find(".selected")[0].id.split("m")[1]);
	if ( num > 1) {
		cur.push(num-1,1);
	}
	cursorCur = cur;
	boardRefresh(board,$aa,moves,cursorCur);

	pgnHilightChange($aa,cursorCur,1);
	chessEngine.load(obj2Fen(moves,cursorCur));
}
},
focus: "#movesPop",
modal: true
});
} else {
	cursorCur = cur;
	boardRefresh(board,$aa,moves,cursorCur);

	pgnHilightChange($aa,cursorCur,1);
	chessEngine.load(obj2Fen(moves,cursorCur));
}
};

function getMultiMoves(moves,cursorCur) {
	var cursor = cursorCur.slice(0)
	,node
	multiMoves = [];
	node = obj2Node(moves,cursor);
	multiMoves.push(node.san);
	if ( node=obj2Node(moves,cursor).rav ) {
		node.forEach(function(rav){
			multiMoves.push(rav[0].san);
		});
	}
	return multiMoves;
}

function stepBack() {
	var cur;
	if (!(cur =curBackward(moves,cursorCur)) || cur[0]==0) {
		cursorCur = [0];
		pgnHilightChange($aa,cursorCur,0);
		boardRefresh(board,$aa,moves,[0],startFen);
		chessEngine.load(startFen);
		return false;
	}
	cursorCur = cur;
	boardRefresh(board,$aa,moves,cursorCur);

	pgnHilightChange($aa,cursorCur,1);
	chessEngine.load(obj2Fen(moves,cursorCur));
};

$("#pgnArea").on('keydown', function(e) {

	e.preventDefault();
        if (e.keyCode == 39) { //right arrow
        	clearTimer();
        	stepFoward();
        } else if (e.keyCode === 37) { // Left
        	clearTimer();
        	stepBack();
        } else if (e.keyCode === 38) { //up
        	clearTimer();
        	startPosition();
        } else if (e.keyCode === 40) { //down
        	clearTimer();
        	endPosition();
        }
    });

$("#movesPop").on('keydown', function(e) {
	e.preventDefault();
		if (e.keyCode == 39) { //right arrow
			$.magnificPopup.close();
		}  else if (e.keyCode === 38) { //up

			var num = parseInt($("#movesPop").find(".selected")[0].id.split("m")[1]);
			if (num>1) {
				$("#movesPop").find("#m"+num).removeClass("selected");
				$("#movesPop").find("#m"+(num-1)).addClass("selected");
			}

        } else if (e.keyCode === 40) { //down

        	var num = parseInt($("#movesPop").find(".selected")[0].id.split("m")[1]);
        	var totalNum = $("#movesPop .moveUl").length;
        	if (num<totalNum) {
        		$("#movesPop").find("#m"+num).removeClass("selected");
        		$("#movesPop").find("#m"+(num+1)).addClass("selected");
        	}
        }
    });

function clearTimer () {
	if (autoMove === true) {
		clearInterval(timer);
		$("#pgnAutoMove>i").removeClass("fa-stop").addClass("fa-play");
		autoMove = false;
	}
		// body...
	}

	function autoPlay () {
		if (autoMove === true) {
			autoMove = false;
			clearTimer();
		} else {
			$("#pgnAutoMove>i").removeClass("fa-play").addClass("fa-stop");
			timer = setInterval (function  () {
				autoMove = true;
				if ( ! stepFowardAuto()) { clearTimer() };
			},1500);
		}
		// body...
	}

    // Position Color End
    // Chessborad & Chess.js
    function onPgnDragStart(source, piece, position, orientation) {
    	clearTimer();
        if (chessEngine.game_over() === true ||
            (chessEngine.turn() === 'w' && piece.search(/^b/) !== -1) ||
            (chessEngine.turn() === 'b' && piece.search(/^w/) !== -1)) {
            return false;
        }

        if (chessEngine.turn() !== ( moveFirst===2?'b':'w')) {
        	return false;
        }
    };


    function onPgnDrop(source, target) {


        var move = chessEngine.move({
            from: source,
            to: target,
            promotion: 'Q'
        });

        // illegal move
        if (move === null) return 'snapback';
        updateStatus(move);
    };

    function onPgnSnapEnd() {
    	if (!moves.length || cursorCur[0] === 0) {
    		boardRefresh(board,$aa,moves,cursorCur,startFen);
			pgnHilightChange($aa,cursorCur,1);
			chessEngine.load(startFen);
			return;
    	}

		boardRefresh(board,$aa,moves,cursorCur);
		pgnHilightChange($aa,cursorCur,1)
		chessEngine.load(obj2Fen(moves,cursorCur));
    };


    var updateStatus = function(move) {
        var status = '';
        var moveColor = 'White';
        if (chessEngine.turn() === 'b') {
            moveColor = 'Black';
        }
        // checkmate?
        if (chessEngine.in_checkmate() === true) {
//            console.log('Game over, ' + moveColor + ' is in checkmate.');
		//	alert("将死！");
       
      
        }
        else if (chessEngine.in_draw() === true) {
            // console.log('Game over, drawn position');
            // $('#movemsg').text('😀，问题解决了！');
        //    alert("和局！")
            return;
        }
        else {
            console.log(moveColor + ' to move');
            // check?
            if (chessEngine.in_check() === true) {
           //     console.log(', ' + moveColor + ' is in check');
       //         return;
            }
        }



      if (! (cursor =checkMoveExisting(moves,cursorCur,chessEngine.fen())) ) {  
 		if ( (cursor = checkMoveExisting(resolvMoves,cursorCur,chessEngine.fen()))) { 
			// var fen = moves.length == 0 ?  startFen : obj2Fen(moves,cursorCur);
			if (moves.length == 0) { 
				moves = pgn.parse(chessEngine.pgn()).movetext.moves;
			} else {
				objAddNode(moves,cursorCur,move);
			}
			objAddFens(moves,startFen);
			objAddOids(moves);
			var cursorMove = cursor.slice(0);

			var curTemp = curForward(resolvMoves,cursor);
			if (curTemp) {
				if (  (multiMoves = getMultiMoves(resolvMoves,curTemp)).length >1) {
					for (var i=0;i<multiMoves.length;i++) {
						curTemp = cursorMove.slice(0)
						objAddNode(moves,cursorMove,{'san':multiMoves[i]});
						cursorMove = curTemp.slice(0);
					}

				} else {
					var sanTemp = obj2San(resolvMoves,curTemp);
					objAddNode(moves,cursorMove,{"san":sanTemp});
				} 
				objAddFens(moves,startFen);
				objAddOids(moves);
				$('#movemsg').text(moveFirst===1?"白方走":"黑方走");
			} else { // 已经是最后一步了，解题的时候也就是说是答案了
				 $('#movemsg').text('😀，问题解决了！');
			}

			cursorCur = cursor.slice(0);
			$(".txtAreaPgn").html(obj2Html(moves,moveFirst));
			
			if (moveFirst == 2) {
				$(".txtAreaPgn #1").text("1..."+  $(".txtAreaPgn #1").text());
			}
			$(".txtAreaPgn a").bind("click",function(e){
				cursorCur = JSON.parse("["+(this.id).replace(/\-/g,",")+"]");
				boardRefresh(board,$aa,moves,cursorCur);
				pgnHilightChange($aa,cursorCur,1)
				chessEngine.load(obj2Fen(moves,cursorCur));
			});

		} else {
			// alert("wrong move");
			$('#movemsg').text('😓, 请再试一次！')
			chessEngine.undo();
		}
    } else {
    	cursorCur = cursor.slice(0);
    	curTemp = curForward(moves,cursorCur);
    	if (curTemp) { cursorCur = curTemp.slice(0);}

    }

    };

	function objAddNode(moves,cursorCur,move) {
	//add san/fen/oid
	// Add in last queue;
	// Add in a Rav
		if ( moves.length == 0 ) {
			moves.push ({fen:chess.fen(),oid:"1",san:move.san});
			return [1];
		}
		if ( !curForward(moves,cursorCur)) {
			var node = obj2ParentNode(moves,cursorCur);
			cursorCur[cursorCur.length-1] += 1;
			node.push({fen:chess.fen(),oid:cursorCur.join("-"),san:move.san});
			return cursorCur;
		} else {
			var node = obj2Node(moves,cursorCur);
	//		moves = pgn.parse(obj2Pgn).movetext.moves;
			if(node.rav) {
				node.rav.push([{fen:chess.fen(),oid:cursorCur.join("-"),san:move.san}]);
				cursorCur.push(node.rav.length,1);
			} else {
				var newRav = {}
				newRav = new Array();
				newRav.push([{fen:chess.fen(),oid:cursorCur.join("-"),san:move.san}]);
				node.rav = newRav;
				cursorCur.push(1,1);
			}
			return cursorCur;
		}
	}


	function checkMoveExisting(moves,cursorCur,fen) {

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

  $('.pgnShare').magnificPopup({
    type:'inline',
    callbacks: {
        open: function() {
          $("#pgnContent").text(data);
          $("#fenContent").text("FEN: "+ obj2Fen(moves,cursorCur));
        }
    },
    midClick: true

  });

//   function pgnParse(pgnString) {

// 	return pgn.parse(pgnString).movetext.moves;
// }


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

});
</script>
<link href="/css/magnific-popup.css" rel="stylesheet" type="text/css">
</body>
</html>