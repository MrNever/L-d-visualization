
/**
 * Created by WH1604067 on 2016/6/30.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.VCAP_APP_PORT || 8099);
app.set('public', __dirname + '/public');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var users = {};//存储在线用户列表的对象

app.get('/', function (req, res) {
  //if (req.cookies.user == null) {
  //  res.redirect('/signin');
  //} else {
    res.sendfile('public/index.html');
 //}
});

var server = http.createServer(app);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
