<!doctype html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Chess</title>

	<link rel="stylesheet" href="http://cdn.bootcss.com/font-awesome/4.3.0/css/font-awesome.min.css">

	<link href="/css/chessboard-0.css" rel="stylesheet" type="text/css">
	<script src="/js/pgnexpansion.js" type="text/javascript"></script>
	<script src="/js/pgnweb.js" type="text/javascript"></script>
	<script src="http://cdn.bootcss.com/jquery/1.11.1/jquery.min.js"></script>
	<script src="/js/chess.js"></script>
	<script src="/js/chessboard-0.js" type="text/javascript"></script>
	<script src="/js/jquery.magnific-popup.min.js"></script>




	<style>
		* {
			margin: 0px;
			padding: 0px;
			font-family: STXihei, "华文细黑", "Microsoft YaHei", "微软雅黑", SimSun, "宋体", Heiti, "黑体", sans-serif;
		}
		a ,i {
			cursor :pointer;
			text-decoration: none;
		}

		.mainboard{
			width: 562px;
			height: 449px;
			position: relative;

		}

		.gamehead {
			width: 562px;
			height: 54px;
			background: #f3f3f3

		}

		.gameuser {
			margin-bottom: 2px;
			font-weight: bold;
			padding: 11px 14px;
			padding-bottom: 0px;
			font-size: 14px;
		}
		.gameinfo{
			padding-left: 14px;
			font-size: 12px;
		}

		.board{
			width: 360px;
			height: 360px;
			float: left;
			background: #f3f3f3


		}
		.moves{
			width: 196px;
			height: 360px;
			margin-left: -5px;
			float: right;
			border-right: 2px solid #f3f3f3;

		}
		.moving{
			width:562px;
			height: 35px;
			background: #f3f3f3

		}

		.movingleft{
			width: 360px;
			height: 35px;
			float: left;
		}

		.movingright {
			widows: 196px;
			height: 35px;
			float: right;
		}

		.rav { color: #839090;display: inline;}

		.clear {
			clear:both;
		}

		.txtAreaPgn {
			height: 360px;
			overflow: auto;
			font-size: 14px;
			line-height: 22px;
			outline: none;
		}

		.moveBut {
			float: left;
			width: 39px;
			padding-top:10px;

		}

		.pgnShare {
			color:black;
			outline:none;
		}

		.moveHilight
		{	background: yellow;
			color:#00f;
		}

		span.comment,span.rate{
			background: #eeeeee;font-style: italic;font-weight: bolder;font-szie:11px;
		}
		.posHighlight_g {
			background : radial-gradient(ellipse at center center , rgba(155, 199, 0, 0.81) 0%, rgba(155, 199, 0, 0) 100%) repeat scroll 0% 0% transparent;
		}

		.posHighlight_r {
			background : radial-gradient(ellipse at center center , rgba(255, 0, 0, 0.81) 0%, rgba(155, 199, 0, 0) 100%) repeat scroll 0% 0% transparent;
		}

		.posHighlight_b {
			background : radial-gradient(ellipse at center center , rgba(0, 0, 255, 0.81) 0%, rgba(155, 199, 0, 0) 100%) repeat scroll 0% 0% transparent;
		}

		.white-popup {
		  position: relative;
		  background: #f3f3f3;
		  padding: 20px;
		  width: auto;
		  max-width: 500px;
		  margin: 20px auto;
			box-shadow: 0px 1px 2px 3px grey;
		}

		.moveSelectPop {

			position: relative;
			background: #FFF;
			max-width: 500px;
			margin: 20px auto;
			box-shadow: 0px 1px 2px 3px grey;
			width: 150px;

		}
		.moveSelectPop  .selected {background: #eee;}
		.moveUl:hover {cursor: pointer;}


	</style>
</head>
<body>
	<div class="mainboard">
		<div class="gamehead">
			<div class="gameuser" id="gameuser"></div>
			<div class="gameinfo" id="gameinfo"></div>
		</div>
		<div class="board" id="board"></div>
		<div class="moves">
			<div class="txtAreaPgn" id="pgnArea"  tabindex="1" placeholder="PGN"> 1. <a id="1">e4 ?? </a>  <a id="2">e5 </a>$1 2. <a id="3">Nf3 </a>$2 <br><span class="comment">Good </span><br>2... <a id="4">Nc6 </a>$3 3. <a id="5">Bc4 </a>$47 3... <a id="6">Bc5 </a> 4. <a id="7">c3 </a>  <a class="moveselect" id="8">Nf6 </a> 5. <a id="9">d4 </a>  ( 5. <a id="9-1-1">d3 </a>  <a id="9-1-2">d6 </a> 6. <a id="9-1-3">Bb3 </a>  <a id="9-1-4">a6 </a> 7. <a id="9-1-5">O-O </a>  <a id="9-1-6">Ba7 </a> 8. <a id="9-1-7">Nbd2 </a>  <a id="9-1-8">O-O </a>  ) 5... <a id="10">exd4 </a> 6. <a id="11">cxd4 </a>  <a class="moveselect" id="12">Bb4+ </a> 7. <a id="13">Nc3 </a>$6 <br><span class="comment">并非很好的选择，却给黑棋设下了一个陷阱 </span><br> ( 7. <a id="13-1-1">Bd2 </a>  <a id="13-1-2">Bxd2+ </a> 8. <a id="13-1-3">Nbxd2 </a>  <a id="13-1-4">d5 </a> 9. <a id="13-1-5">exd5 </a>  <a id="13-1-6">Nxd5 </a> 10. <a id="13-1-7">Qb3 </a>  ) 7... <a id="14">Nxe4 </a> <br><span class="comment">利用牵制战术吃得一兵 </span><br>8. <a id="15">O-O </a>  </div>
		</div>
		<div class="moving clear">
			<div class="movingleft">
				<div style="float:left;margin-left:10px;padding-top:8px">
					<a href="#pgnsharepopup" class="pgnShare"><i class="fa fa-fw fa-share-square-o"></i></a>
				</div>
				<div style="float:right;margin-right:10px;padding-top:8px" id="pgnflip"><i class="fa fa-fw fa-retweet"></i></div>
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
		  <div style="border:1px dotted grey;width:80%;Height:200px;font-size:14px;line-height:18px;overflow:scroll" id="pgnContent"></div>
		  <div style = "border: 1px dotted grey;margin-top: 10px;width:80%;font-size:14px;line-height:18px;" id="fenContent" >FEN: </div>
	</div>

	<script type="text/javascript">
		$(document).ready(function() {
			var cfg = {
				draggable: false,
				position: 'start',
				sparePieces: false
			};

			var board = new ChessBoard('board', 'start');
			var $aa = $("#board");

			var chess = new Chess();
			var pgn = new pgnParse();
			var cursorCur = [0];
			var moves = []
			,pgnmove = {};


			var timer,autoMove = false;

			//// Template Part1
