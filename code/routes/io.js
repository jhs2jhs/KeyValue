var db = require("./db.js");
var myutil = require("./myutil.js");

function simple_callback(req_obj){
	return req_obj.callback(req_obj);
}

/////////////////////////////////////////////
// user management
exports.user_find_one = function(req_obj){
	req_obj.db_opt_callback = db.user_find_one;
	req_obj.io_callback = user_find_one_cp;
	return db.db_opt(req_obj);
}

function user_find_one_cp(err, user, req_obj){
	//myutil.debug(err, user);
	if (err) { return req_obj.done(err); }
	if (!user) {
		return req_obj.done(null, false, { message: 'Incorrect username.' });
	}
	if (!user.password == req_obj.password) {
		return req_obj.done(null, false, { message: 'Incorrect password.' });
	}
	myutil.debug("user_find_one_cp");
	return req_obj.done(null, user);
}

exports.user_deserialize = function(req_obj){
	req_obj.db_opt_callback = db.user_find_one;
	req_obj.io_callback = user_deserialize_cp;
	return db.db_opt(req_obj);
}

function user_deserialize_cp (err, user, req_obj){
	myutil.debug("deserialize_user_cp", err, user);
	req_obj.done(err, user);
}

///////////////////////////////////////////////
// memo
exports.memo_get_single = function(req_obj){
	req_obj.db_opt_callback = db.memo_find_one;
	req_obj.io_callback = simple_callback;
	return db.db_opt(req_obj);
}
exports.memo_get_all = function(req_obj){
	req_obj.db_opt_callback = db.memo_find_all;
	req_obj.io_callback = simple_callback;
	return db.db_opt(req_obj);
}

//
exports.memo_put_single = function(req_obj){
	req_obj.db_opt_callback = db.memo_insert_one;
	req_obj.io_callback = simple_callback;
	return db.db_opt(req_obj);
}