
/**
 * Module dependencies.
 */

var express = require('express')
  , mongoose = require('mongoose')
  , http = require('http')
  , path = require('path')
    , userModel = require('./models/user')
    ,userRoute = require('./routes/user');
var auth = require('basic-auth');
var app = express();

var checkUser = function(req, res, next) {
    if(!!auth(req)) {
        req.username = auth(req).name;
        next();
    } else if(!!req.query.auth) {
        var fromStr = new Buffer(req.query.auth, 'base64').toString();
        req.username = fromStr.substring(0, fromStr.indexOf(':'));
        req.password = fromStr.substring(fromStr.indexOf(':') + 1);
        next();
    } else {
        res.status(401).send('Error: 401 Authorization required for this request');
        return;
    }
}

app.use(express.static(path.join(__dirname, 'public')));

app.configure(function(){
  app.set('port', process.env.PORT || 8080);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  //app.use(checkUser);
  
});

 app.all("/api/*", function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With, Accept");
      res.header("Access-Control-Allow-Methods", "GET, PUT, POST, HEAD, DELETE, OPTIONS");
      return next();
  });

app.configure('development', function(){
  app.use(express.errorHandler());
});

var uriString =
    process.env.MONGOLAB_URI ||
        process.env.MONGOHQ_URL ||
        'mongodb://localhost/HelloMongoose';

mongoose.connect('mongodb://shrouded-basin-user:test@ds035846.mlab.com:35846/shrouded-basin');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
   console.log('Successfully mongodb is connected');
});

app.get('/version', function(req, res) {
    res.send('0.0.0');
});
app.get('/api/user',userRoute.index)
app.get('/api/user/:id',userRoute.findById);
app.put('/api/user/:id',userRoute.update);
app.delete('/api/user/:id',userRoute.delete)
app.post('/api/user',userRoute.newUser);


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
