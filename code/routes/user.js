var db = require("./db.js");
var LocalStrategy = require('passport-local').Strategy;
var passport = require("passport");
var myutil = require("./myutil.js");
var ObjectID = require("mongodb").ObjectID;
var io = require("./io.js");


/*
 * GET users listing.
 */

exports.list = function(req, res){
	res.send("respond with a resource");
};

exports.my_passport_local_strategy = function(){
	var my_strategy = new LocalStrategy(
		function(username, password, done) {
			myutil.debug("my_passport_local_strategy ====", username);
			var req_obj = {};
			req_obj.qry_obj = {username: username };
			req_obj.username = username;
			req_obj.password = password;
			req_obj.done = done;
			return io.user_find_one(req_obj);
		}
	);
	return my_strategy;
};

function serialize_user (user, done) {
	myutil.debug("serialize_user");
	done(null, user._id);
}
function deserialize_user (id, done) {
	myutil.debug("deserialize_user");
	var req_obj = {};
	req_obj.qry_obj = {_id: new ObjectID(id) };
	req_obj.done = done;
	myutil.debug("req_obj", req_obj);
	return io.user_deserialize(req_obj);
}


exports.serialize_user = serialize_user;
exports.deserialize_user = deserialize_user;

exports.logout = function(req, res){
	req.logout();
	res.redirect('/');
};
exports.login_get = function(req, res){
	res.render("login");
  //res.send("<html><body><a href='http://localhost:3000/users?username=hello&password=worldw'>login</body></html>");
};

exports.login_post = function(req, res, next){
	passport.authenticate('local', function(err, user, info){
		if (err) {return next(err);}
		if (!user) {return res.redirect('/login');}
		req.logIn(user, function(err){
			if (err) {return next(err);}
			return res.redirect(req.session.returnTo);
		});
	})(req, res, next);
};