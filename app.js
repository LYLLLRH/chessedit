var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var chesswidget = require('./routes/chesswidget');  // 支持NodeBB的嵌入式PGN；
var pgnadd = require('./routes/pgnadd');
var puzzleadd = require('./routes/puzzleadd');
var pgnlist = require('./routes/pgnlist');
var pgnget = require('./routes/pgnget');
var puzzlewidget = require('./routes/puzzlewidget'); 


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(__dirname+'/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'),{maxAge:60*60*1000,hidden:false}));
//app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.post('/pgn/add',pgnadd);
app.post('/puzzle/add',puzzleadd);
app.get('/pgn/list/:user',pgnlist);
app.get('/s/:id',pgnget);
app.get('/h/:id',chesswidget);
app.get('/p/:id',puzzlewidget);



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
