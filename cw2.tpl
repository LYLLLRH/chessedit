    // Tmplate Part2
    $("#gameuser").text (game.gameplay);   // 需要在服务器端设置
	$("#gameinfo").text (game.gameinfo); // 需要在服务器端设置
	// strObj 需要在服务器端设置

    initialStatus(game.pgn);



	$(".txtAreaPgn").html(obj2Html(moves,1));
	$(".txtAreaPgn a").bind("click",function(e){
		cursorCur = JSON.parse("["+(this.id).replace(/\-/g,",")+"]");
		boardRefresh(board,$aa,moves,cursorCur);
		pgnHilightChange($aa,cursorCur,1)
	});


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
    	boardRefresh(board,$aa,moves,cursorCur);
    	pgnHilightChange($aa,cursorCur,1);
    });

    function stepBack() {
    	var cur;
    	if (!(cur =curBackward(moves,cursorCur)) || cur[0]==0) {
    		cursorCur = [0];
    		pgnHilightChange($aa,cursorCur,0);
    		boardRefresh(board,$aa,moves,[0]);
    		return false;
    	}
    	cursorCur = cur;
    	boardRefresh(board,$aa,moves,cursorCur);
    	pgnHilightChange($aa,cursorCur,1);
    };

    function startPosition() {
    	cursorCur = {};
    	cursorCur = [0];
    	boardRefresh(board,$aa,moves,cursorCur);
    	pgnHilightChange($aa,cursorCur,0);
    };

    function endPosition() {
    	cursorCur =  {};
    	cursorCur = [moves.length];
    	boardRefresh(board,$aa,moves,cursorCur);
    	pgnHilightChange($aa,cursorCur,1);
    };

    function stepFowardAuto (argument) {
    	if (!(cur =curForward(moves,cursorCur))) {
    		return false;
    	} else {
    		cursorCur = cur;
    		boardRefresh(board,$aa,moves,cursorCur);

    		pgnHilightChange($aa,cursorCur,1);
    		return true;
    	}
    }
    function stepFoward() {
    	var cur;
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
}
},
focus: "#movesPop",
modal: true
});
} else {
	cursorCur = cur;
	boardRefresh(board,$aa,moves,cursorCur);

	pgnHilightChange($aa,cursorCur,1);
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
		boardRefresh(board,$aa,moves,[0]);

		return false;
	}
	cursorCur = cur;
	boardRefresh(board,$aa,moves,cursorCur);

	pgnHilightChange($aa,cursorCur,1);
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

	function initialStatus(pgnStr) {
		if  ( (!pgnStr.match(/^\s+$/)) && (pgnmove = pgn.parse(pgnStr))  ) {
			moves = pgnmove.movetext.moves;
			var fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
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

			return true;
		} else {
			return false;
		}
	}

  $('.pgnShare').magnificPopup({
    type:'inline',
    callbacks: {
        open: function() {
          $("#pgnContent").text(obj2PgnStandard(moves));
          $("#fenContent").text("FEN: "+board.fen());
        }
    },
    midClick: true

  });

/*   $('.pgnShare').click(function(ev){
     var text = $('.pgnShare').text();
     $('.pgnShare').text(text+'1');
   }) */
});
</script>
<link href="/css/magnific-popup.css" rel="stylesheet" type="text/css">
</body>
</html>
