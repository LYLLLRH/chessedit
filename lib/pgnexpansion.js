//Obj->San Fen Comments LineBoardCell  add/remove/update

var regLine = /\[%line\s+([a-h][1-8]):([a-h][1-8]):([rgb])\]/;
var regBoardCell = /\[%position\s+([a-h][1-8]):([rgb])\]/;

// refresh board/highlight select
// get cursor -> fen -> boardcell -> line
function nagConvert (nag) {
    var nagArray = {"$1":"!","$2":"?","$3":"!!","$4":"??","$5":"!?","$6":"?!"};
    return (nagArray[nag] || "");
    // return nag;
}

function boardRefresh(board, $board, moves, obj) {
    var theObj = obj.slice(0);
    lineCells = obj2LineBoard(moves, obj);
    board.position(obj2Fen(moves, obj), false);
    if ($board.find(".board-b72b1").find(".lineControl").length > 0) {
        $board.find(".board-b72b1").find(".lineControl").remove();
    }

    if ($board.find(".board-b72b1").find(".posHighlight").length > 0) {
        $board.find(".board-b72b1").find(".posHighlight")
            .removeClass("posHighlight_g")
            .removeClass("posHighlight_r")
            .removeClass("posHighlight_b")
            .removeClass("posHighlight");
    }
    if (lineCells) {
        if (lineCells.lines) {
            for (var i = 0; i < lineCells.lines.length; i++) {
                var line = lineCells.lines[i];
                boardDrawLine($board, line.s, line.e, line.c);
            }
        }
        if (lineCells.positions) {
            for (var i = 0; i < lineCells.positions.length; i++) {
                var pos = lineCells.positions[i];
  //              console.log(pos);
                $board.find(".board-b72b1").find(".square-" + pos.p).addClass("posHighlight").addClass("posHighlight_" + pos.c);
            }

        }
    }
    var mm = obj2MM(moves,obj);
    if (mm){

       $board.find(".board-b72b1").find(".square-" + mm.from).addClass("posHighlight").addClass("posHighlight_" + 'g');
       $board.find(".board-b72b1").find(".square-" + mm.to).addClass("posHighlight").addClass("posHighlight_" + 'g');
    }
}

// cursor function start
function curForward(moves, cursorCur) {
    var cursor = cursorCur.slice(0);
    while (cursor.length != 1) {
        moves = moves[cursor.shift() - 1]["rav"][cursor.shift() - 1];
    }
    if (moves.length != cursor[0]) {
        cursorCur[cursorCur.length - 1] += 1; //Same level + 1;
        return cursorCur;
    } else {
        return false;
    }
}

function curBackward(moves, cursorCur) {
    var cursor = cursorCur.slice(0);
    if (cursor[0] == 0) {
        return false;
    } // end of return;}
    while (cursor[cursor.length - 1] == 1 && (cursor.length > 1)) {
        //			console.log(cursor);
        cursor.pop();
        cursor.pop();
    }
    //	console.log(cursor);
    cursor[cursor.length - 1] -= 1; //cursor[cursor.length-1];
    return cursor;
}

// cursor function start

// Get function Area start

function obj2Html(theObj, number) {
    var retStr = " ";
    var lastseq = true;
    var number = number || 1;
    for (var i = 0; i < theObj.length; i++) {
        var move = theObj[i];
        var seq = true;
        var moveStr = "";
        var commentStr = "",
            nagStr = "",
            ravStr = "";
        for (var p in move) {
            if (typeof move[p] == 'object') {
                switch (p) {
                    case "comments":
                        for (var j = 0; j < move[p].length; j++) {
                            if (!move[p][j].match(/^\[%/)) {
                                if (move[p][j].length !=0) {
									commentStr += " { <span class=\"comment\">" + move[p][j] + " </span> } ";
									seq = false;
								}	
							}
						}		
                        break;
                    case "rav":
                        for (var j = 0; j < move[p].length; j++) {
                            var strNum = "";
                            strNum = number % 2 ? "" : number / 2 + "... ";
                            if ( move[p][j].length !=0 ) { 
							ravStr += " (" + strNum + obj2Html(move[p][j], number) + " ) ";
							seq = false;
							}
                        }
						break;
                    case "nag":
                        for (var j = 0; j < move[p].length; j++) {
                            nagStr += nagConvert( move[p][j]); 
                        }
                        seq = nagStr == ''? true:false;
                        break;
                    case "fen":
                    case "point":
                    case "rate":
                    case "eval":
                    case "bestmove":
                    case "snapshot":
                    default:
                        break;
                }
            } else {
                if (p == "san") {
                    var strNum = "";
                    if ((!lastseq)) {
                        strNum = (number % 2) ? (number + 1) / 2 + ". " : number / 2 + "... ";
                    } else {
                        strNum = (number % 2) ? (number + 1) / 2 + ". " : " ";
                    }
                    moveStr = strNum + "<a id=\"" + move["oid"] + "\">" + move[p] + " </a>" 
					number++;

                }
            }

        }
		if ( (i <theObj.length-1) && theObj[i+1].rav) {
		moveStr = moveStr.replace("<a ","<a class=\"moveselect\" ");
		}
		moveStr += nagStr + " " + commentStr + ravStr;
//		number++;
		lastseq = seq;
        retStr += moveStr;
    }
    return retStr;

}

function obj2PgnStandard(theObj, number) {
    var retStr = " ";
    var lastseq = true;
    var number = number || 1;
    for (var i = 0; i < theObj.length; i++) {
        var move = theObj[i];
        var seq = true;
        var moveStr = "";
        var commentStr = "",
            nagStr = "",
            ravStr = "";
        for (var p in move) {
            if (typeof move[p] == 'object') {
                switch (p) {
                    case "comments":
                        for (var j = 0; j < move[p].length; j++) {
                            if (!move[p][j].match(/^\[%/)) {
                                if (move[p][j].length !=0) {
									commentStr += " {" + move[p][j] + "} ";
									seq = false;
								}	
							}
						}		
                        break;
                    case "rav":
                        for (var j = 0; j < move[p].length; j++) {
                            var strNum = "";
                            strNum = number % 2 ? "" : number / 2 + "... ";
                            if ( move[p][j].length !=0 ) { 
							ravStr += " (" + strNum + obj2PgnStandard(move[p][j], number) + " ) ";
							seq = false;
							}
                        }
						break;
                    case "nag":
                        for (var j = 0; j < move[p].length; j++) {
                            nagStr += nagConvert(move[p][j]); 
                        }
                        seq = nagStr == ''? true:false;
                        break;
                    case "fen":
                    case "point":
                    case "rate":
                    case "eval":
                    case "bestmove":
                    case "snapshot":
                    default:
                        break;
                }
            } else {
                if (p == "san") {
                    var strNum = "";
                    if ((!lastseq)) {
                        strNum = (number % 2) ? (number + 1) / 2 + ". " : number / 2 + "... ";
                    } else {
                        strNum = (number % 2) ? (number + 1) / 2 + ". " : " ";
                    }
                    moveStr = strNum + move[p] +" ";  
					number++;

                }
            }

        }
		moveStr += nagStr + " " + commentStr + ravStr;
//		number++;
		lastseq = seq;
        retStr += moveStr;
    }
    return retStr;

}


function obj2Pgn(theObj, number) {
    var retStr = " ";
    var lastseq = true;
    var number = number || 1;
    for (var i = 0; i < theObj.length; i++) {
        var move = theObj[i];
        var seq = true;
        var moveStr = "";
        var commentStr = "",
            nagStr = "",
            ravStr = "";
        for (var p in move) {
            if (typeof move[p] == 'object') {
                switch (p) {
                    case "comments":
                        for (var j = 0; j < move[p].length; j++) {
                            if (move[p][j].length !=0) {
									commentStr += " {" + move[p][j] + "} ";
									seq = false;
							}
						}				
                        break;
                    case "rav":
                        for (var j = 0; j < move[p].length; j++) {
                            var strNum = "";
                            strNum = number % 2 ? "" : number / 2 + "... ";
                            if ( move[p][j].length !=0 ) { 
							ravStr += " (" + strNum + obj2Pgn(move[p][j], number) + " ) ";
							seq = false;
							}
                        }
                        break;
                    case "nag":
                        for (var j = 0; j < move[p].length; j++) {
                            nagStr += nagConvert(move[p][j]); //document.write("<br>"+retStr);
                        }
                        break;
                    case "fen":
                    case "point":
                    case "rate":
                    case "eval":
                    case "bestmove":
                    case "snapshot":
                    default:
                        //						console.log("default:"+p+ " " + move[p]);
                        break;
                }
            } else {
                if (p == "san") {
                    var strNum = "";
                    if ((!lastseq)) {
                        strNum = (number % 2) ? (number + 1) / 2 + ". " : number / 2 + "... ";
                    } else {
                        strNum = (number % 2) ? (number + 1) / 2 + ". " : " ";
                    }
                    moveStr = strNum + move[p] + " " ;
					number ++ ;
                }
            }

        }
		moveStr += nagStr + " " + commentStr + ravStr;
		lastseq = seq;
        retStr += moveStr;
    }
    return retStr;
}



function obj2San(moves, cursorCur) {
    var move;
    var cursor = cursorCur.slice(0);
    //	console.log(moves,cursor);
    if (cursor.length == 1) {
        return cursor[0] == 0 ? "start" : moves[cursor[0] - 1]["san"];
    } else {
        if (moves[cursor[0] - 1]["rav"]) {
            return obj2San(moves[cursor.shift() - 1]["rav"][cursor.shift() - 1], cursor);
        } else {
            return obj2San(moves[cursor.shift() - 1], cursor);
        }
    }
}

function obj2Fen(moves, cursorCur) {
    var move;
    var cursor = cursorCur.slice(0);
    if (cursor.length == 1) {
        return cursor[0] == 0 ? "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" : moves[cursor[0] - 1]["fen"];
    } else {
        if (moves[cursor[0] - 1]["rav"]) {
            return obj2Fen(moves[cursor.shift() - 1]["rav"][cursor.shift() - 1], cursor);
        } else {
            return obj2Fen(moves[cursor.shift() - 1], cursor);
        }
    }
}

function obj2MM(moves, cursorCur) {
    var move;
    var cursor = cursorCur.slice(0);
    if (cursor.length == 1) {
        return cursor[0] == 0 ? null : moves[cursor[0] - 1]["mm"];
    } else {
        if (moves[cursor[0] - 1]["rav"]) {
            return obj2MM(moves[cursor.shift() - 1]["rav"][cursor.shift() - 1], cursor);
        } else {
            return obj2MM(moves[cursor.shift() - 1], cursor);
        }
    }
}

function obj2LineBoard(moves, cursorCur) {
    var move;
    var cursor = cursorCur.slice(0);
    if (cursor.length == 1) {
        if (cursor[0] == 0 || !moves[cursor[0] - 1] || !moves[cursor[0] - 1].comments) {
            return false;
        }
        var comments = moves[cursor[0] - 1].comments;
        var retObj = {};
        var lines = new Array();
        var positions = new Array();
        for (var i = 0; i < comments.length; i++) {
            if (line = comments[i].match(regLine)) {
                lines.push({
                    s: line[1],
                    e: line[2],
                    c: line[3]
                });
            } else if (boardCell = comments[i].match(regBoardCell)) {
                existing = true;
                positions.push({
                    p: boardCell[1],
                    c: boardCell[2]
                });
            }
        }
        return (lines.length > 0 || positions.length > 0) ? {
            lines: lines,
            positions: positions
        } : false;
    } else {
        if (moves[cursor[0] - 1]["rav"]) {
            return obj2LineBoard(moves[cursor.shift() - 1]["rav"][cursor.shift() - 1], cursor);
        } else {
            return obj2LineBoard(moves[cursor.shift() - 1], cursor);
        }
    }
}

function obj2Node(moves, cursorCur) {
    var move;
    var cursor = cursorCur.slice(0);
    if (cursor.length == 1) {
        if (cursor[0] == 0) {
            return false;
        }
        return moves[cursor[0] - 1];
    } else {
        if (moves[cursor[0] - 1]["rav"]) {
            return obj2Node(moves[cursor.shift() - 1]["rav"][cursor.shift() - 1], cursor);
        } else {
            return obj2Node(moves[cursor.shift() - 1], cursor);
        }
    }
}


function pgnHeadObj2Html(theObj) {


}

function objAddFens(moves, fen, callback) {
    for (var i = 0; i < moves.length; i++) {
        if (moves[i].rav) {
            var temp = moves[i].rav;
            for (var j = 0; j < temp.length; j++) {
                objAddFens(moves[i].rav[j], fen, callback);
            }

        }
        callback.call(null, moves[i], fen);
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


// Add function Area end

// addition board manuniplation : draw a line with color
function boardDrawLine(board, startPos, endPos, color) {
    var colors = {
        'b': 'arrow_box',
        'r': 'arrow_box_r',
        'g': 'arrow_box_g'
    };
    var start = startPos,
        end = endPos;
    var boardEl = board;
    var starts = start.split('');
    var ends = end.split('');
    if (boardEl.find('.' + start + end).length == 0) { // if not exist, draw this line
        var squareWidth = boardEl.find('[data-square="a1"]').width();
        var startPosition = boardEl.find('[data-square="' + start + '"]').position();
        var endPosition = boardEl.find('[data-square="' + end + '"]').position();
        var arrowWidth = squareWidth / 8;
        var top = startPosition.top + squareWidth / 2 - arrowWidth * 3 / 4;
        var left = startPosition.left + squareWidth / 2;
        var angle = Math.atan2((endPosition.top - startPosition.top), endPosition.left - startPosition.left) / 3.14159 * 180;
        var length = Math.sqrt(Math.pow(Math.abs(endPosition.top - startPosition.top) - 12, 2) + Math.pow(Math.abs(endPosition.left - startPosition.left) - 12, 2)) - 20;
        var arrow_box = colors[color];
        var arrowHtml = '';
        arrowHtml = '<div class="' + arrow_box + ' lineControl lineControl' + start + end + '" style="position:absolute;top:' + (top) + 'px;left:' + left + 'px;width:' + length + 'px;height:' + 7 + 'px;opacity: .5;transform:rotate(' + angle + 'deg);-webkit-transform:rotate(' + angle + 'deg);-webkit-transform-origin:0px;transform-origin:0px"></div>';
        boardEl.find(".row-5277c:last").after(arrowHtml);
    }
}



function pgnHilightChange($board, oid, bg) {
    if (!bg || oid[0] == 0) {
        $(".moveHilight").removeClass("moveHilight");
		$(".txtAreaPgn").scrollTop(0);
		return ;
    }
    $(".moveHilight").removeClass("moveHilight");
    var oidStr = JSON.stringify(oid).slice(1, -1).replace(/\,/g, "-");

    $(".txtAreaPgn").find("#" + oidStr).addClass("moveHilight");

    /*		var lastClass = document.getElementsByClassName("last");
		if (lastClass != null) {
			var length = lastClass.length;
			for (var i=0;i<length;i++){
	//				c = lastClass.className;
				lastClass[0].className = lastClass[0].className.replace(' last','');
			}
		}
	*/	
		var offsetTop = getOffsetTop(oidStr)-getOffsetTop('1');
		if ( offsetTop > 290 ) {
			$(".txtAreaPgn").scrollTop(offsetTop-280);
		} else {
				$(".txtAreaPgn").scrollTop(0);
		}
		// id = 0 为开始棋局需要单独处理；
		
/*		
		if (bg==0) {
			document.getElementById((id)+'').className="";
		} else {
			document.getElementById(lastMove[startStep-1].from).className += ' last';
			document.getElementById(lastMove[startStep-1].to).className += ' last';
			// If scroll is true, check scroll
		}
		*/
}

function updateObjLine(moves,cursorCur,line,flag){
	var node = obj2Node(moves,cursorCur);
	var lineTemp;
	if (!node) {return false;}
	if (node.comments) {
		for (var i=0;i<node.comments.length;i++) {
			if ( (lineTemp = node.comments[i].match(/([a-h1-8:]{5})/))) {
				if (lineTemp[0] == line.slice(0,-2)) {
					node.comments.splice(i,1);
					break;
				}
			}
		}
		if (flag) {
			node.comments.push("[%line "+line+"]");
		}		
	} else {
		if (flag) {
			var comment = ["[%line "+line+"]"];
			node.comments = comment;
		}
	console.log(JSON.stringify(node));
	}	
}

function updateObjCell(moves,cursorCur,cell,flag){
	var node = obj2Node(moves,cursorCur);
	var cellTemp;
	if (!node) {return false;}
	if (node.comments) {
		for (var i=0;i<node.comments.length;i++) {
			if ( (cellTemp = node.comments[i].match(/position ([a-h][1-8]):[rgb]/))) {
				if (cellTemp[1] == cell.slice(0,-2)) {
					node.comments.splice(i,1);
					break;
				}
			}
		}
		if (flag) {
			node.comments.push("[%position "+cell+"]");
		}		
	} else {
		if (flag) {
			var comment = ["[%position "+cell+"]"];
			node.comments = comment;
		}
	console.log(JSON.stringify(node));
	}	
}

function updateObjComm(moves,cursorCur,comm){
	var node = obj2Node(moves,cursorCur);
	var commTemp;
	if (!node) {return false;}
	if (node.comments) {
		for (var i=0;i<node.comments.length;i++) {
			if ( !(node.comments[i].match(/^\[%/))) {
				if (comm=="") {
					node.comments.splice(i,1);
					if (node.comments.length == 0) {delete node.comments;}
					break;
				}
				if (comm!="") {node.comments[i] = comm;}
				break;
			}
		}
	} else {
		var comment = [comm];
		if (comm!="") {node.comments = comment;}
	}	
	console.log(node.comments);
}

function updateObjRate(moves,cursorCur,rate)  {
	var node = obj2Node(moves,cursorCur);
	if (rate == "") {
		node.san = node.san.split(" ")[0];
	} else {
		node.san = node.san.split(" ")[0] +" " +rate; 
	}
	console.log(node.san);
}

function updateHtmlRate($pgnHtml,cursorCur,rate){
	
	var san = $pgnHtml.find("#"+cursorCur.join("-")).text();
	if (rate=="") {
		$pgnHtml.find("#"+cursorCur.join("-")).text(san.split(" ")[0]+" ");
	} else {
		$pgnHtml.find("#"+cursorCur.join("-")).text(san.split(" ")[0]+" "+rate);
	}
}


function checkPositionValid(position) {
	if ( position.length == 2) {
		if (/[a-h][1-8]/.exec(position)) return true;
	} else {
	return false;
	}
}

function initialStatus(moves,cursorCur,board) {
	moves = {};
	cursorCur = [];
	board.position("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");

}
// Delete nodes which after cursorCur, 
function objDelNode(moves,cursorCur){
	// splice for everynode excepet first node; moves = [0], pgn = null;
	if (cursorCur[0] == 0) { return false;}
	cursor = curBackward(moves,cursorCur).slice(0);
	node = obj2ParentNode(moves,cursorCur);
	var index = cursorCur[cursorCur.length-1]-1;
	node.splice(index,node.length-index+1);
	return cursor;
}

// Get node's parents; clear node 
function obj2ParentNode(moves, cursorCur) {
	var move;
	var cursor = cursorCur.slice(0);
	if (cursor.length == 1) {
		if (cursor[0] == 0) {
			return false;
		}
		return moves;
	} else {
		if (moves[cursor[0] - 1]["rav"]) {
			return obj2ParentNode(moves[cursor.shift() - 1]["rav"][cursor.shift() - 1], cursor);
		} else {
			return obj2ParentNode(moves[cursor.shift() - 1], cursor);
		}
	}
}	

function getOffsetTop(id) {
	return document.getElementById(id).offsetTop;
}