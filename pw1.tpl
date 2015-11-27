<!doctype html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0 , maximum-scale=1.0 ,user-scalable=no">
	<title>Chess</title>
	<link rel="stylesheet" href="/css/bootstrap.min.css">
	<link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css">
	<link rel="stylesheet" href="/css/widget.css">
	<link href="/css/chessboard-0.css" rel="stylesheet" type="text/css">
	<script src="/js/pgnexpansion.js" type="text/javascript"></script>
   <script src="/js/pgnweb.js" type="text/javascript"></script>
	<script src="/js/jquery.min.js"></script>
	<script src="/js/chess.js"></script> 
	<script src="/js/chessboard-0.js" type="text/javascript"></script>
	<script src="/js/jquery.magnific-popup.min.js"></script>
</head>
<body>
	<div class="mainboard">
		<div class="gamehead">
			<div class="gameuser" id="gameuser"></div>
			<div class="gameinfo" id="gameinfo"></div>
		</div>

		<div class="board" id="board"></div>
		<div class="moves">
			<div id="movemsg"></div>
			<div class="txtAreaPgn" id="pgnArea"  tabindex="1" placeholder="PGN"> 1. <a id="1">e4 ?? </a> </div>
		</div>
		<div class="clear"><div>
		<div class="moving clear">
			<div class="movingleft">
				<div class="shareBut" id>
					<a href="#pgnsharepopup" class="pgnShare"><i class="fa fa-fw fa-eye"></i></a>
				</div>
				<div class="flipBut" id="pgnflip"><i class="fa fa-fw fa-retweet"></i></div>
			</div>
			<div class="movingright">
				<div class="moveBut" id="pgnStartPosition"><i class="fa fa-step-backward fa-fw"></i></div>
				<div class="moveBut" id="pgnStepBackward"><i class="fa fa-backward fa-fw"></i></div>
				<div class="moveBut" id="pgnAutoMove"><i class="fa fa-play fa-fw"></i></div>
				<div class="moveBut" id="pgnStepForward"><i class="fa fa-forward fa-fw"></i></div>
				<div class="moveBut" id="pgnEndPosition"><i class="fa fa-step-forward fa-fw"></i></div>
			</div>
		</div>
	</div>
	<div id="moveSelect" class="moveSelectPop mfp-hide" tabindex="-1">
		<div id="movesPop" tabindex="-1">
		</div>
	</div>
	<div id="pgnsharepopup" class="white-popup mfp-hide">
		  <div style="border:1px dotted grey;width:90%;Height:200px;font-size:13px;line-height:18px;overflow:scroll" id="pgnContent"></div>
		  <div style = "border: 1px dotted grey;margin-top:10px;width:90%;font-size:13px;line-height:18px;" id="fenContent" >FEN: </div>
	</div>

	<script type="text/javascript">
		$(document).ready(function() {

			var chess = new Chess();
			var chessEngine = new Chess();
			var pgn = new pgnParse();
			var cursorCur = [0];
			var moves = []
			,pgnmove = {};
			var gamepaly = 'Whithe vs Black';
			var gameinfo = 'Example test';
			var startFen = '';
			var resolvMoves = '';
			var resolvCur = '';
			var moveFirst =1 ; //1  为白先走，2为黑先走，在做题目的时候需要；
			var timer,autoMove = false;
			var board;
			
			if (matchMedia) {
				var mq = window.matchMedia("(min-width: 478px)");
				mq.addListener(WidthChange);
				WidthChange(mq);
			}

			// media query change
			function WidthChange(mq) {

				if(board) { board.resize();}
				console.log("width change");

			// if (mq.matches) {

			// 	console.log("width>=500");
			// 	// window width is at least 500px
			// }
			// else {
			// 	console.log("width<500");
			// // window width is less than 500px
			// }
			}
			// $(window).on('orientationchange', function() {
  	// 			console.log("Change!");
  	// 			if(board) { board.resize();}
			// });


