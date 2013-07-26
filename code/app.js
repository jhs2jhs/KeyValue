
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;
var db = require("./routes/db.js");
var memo = require("./routes/memo.js");
var myutil = require("./routes/myutil");
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var MongoStore = require("connect-mongo")(express);

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
// for passport
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({
	cookie: {maxAge:360000000}, 
	secret:"keyboard cat",
	store: new MongoStore({
		url: db.mongodb_url+"/sessions"
	})
})
);
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
passport.use(user.my_passport_local_strategy());
passport.serializeUser(user.serialize_user);
passport.deserializeUser(user.deserialize_user);


// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}


app.get('/users', user.list);
app.get('/login', user.login_get);
app.get('/logout', user.logout);
app.post('/login', user.login_post);
app.get('/memo', ensureLoggedIn('/login'), memo.main);
app.get('/', routes.index);

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
