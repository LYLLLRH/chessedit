
var engine_log  = $('#engine_log');

var print = function(m, p) {
    p = (p === undefined) ? '' : JSON.stringify(p);
    $('#engine_log').append($("<code>").text(m + ' ' + p ));
    $('#engine_log').append($("<br>"));
    $('#engine_log').scrollTop($('#engine_log').scrollTop()+10000);
    // $('#engine_log').append(m + ' ' + p + $("<br>"));
};

print("Good Start!",'hello');
// configure sockjs

var sockjs_url = '/engine';
var sockjs = new SockJS(sockjs_url);
function callEngine(fen) {
  console.log(fen);
  sockjs.send(JSON.stringify({fen : fen}));
  // body...
}
sockjs.onopen    = function()  {
  print('[*] open', sockjs.protocol);
};
sockjs.onmessage = function(e) {
  var engineMove = JSON.parse(e.data);
  console.log(engineMove.data);
  if(engineMove.type == "log"){
    print('', engineMove.data);
  }else if (engineMove.type == "move"){
    print('Engines Move: ', engineMove.data);
    // makeEngineMove(engineMove.data.from,engineMove.data.to);

  }
};

sockjs.onclose   = function() {
  print('[*] close');
};
