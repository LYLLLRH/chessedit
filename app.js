var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
// var chesswidget = require('./routes/chesswidget');  // 支持NodeBB的嵌入式PGN；
 var pgnadd = require('./routes/pgnadd');
// var pgnget = require('./routes/pgnget');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.post('/pgn/add',pgnadd);
// app.use('/pgn/:id',pgnget);
// app.use('/html/:id',chesswidget);

app.get('/user/:id', function (req, res, next) {
  console.log(req.params.id);
  if (!req.params.id) { next();} else { res.end(req.params.id);}
});

// app.post('/pgn/add',function (req,res) {
//   var body ='';
//   console.log(req.body.pgn);
//   res.end("http://www.lychess.net/html/2015063001");
// });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});




// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
