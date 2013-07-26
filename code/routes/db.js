var MongoClient = require('mongodb').MongoClient
    , format = require('util').format;  
var ObjectID = require('mongodb').ObjectID;
var myutil = require("./myutil.js");

var mongodb_url = "mongodb://127.0.0.1:27017/keyvalue";
exports.mongodb_url = mongodb_url;

// wrapper function for all main entrance
exports.db_opt = function(req_obj){
    MongoClient.connect(mongodb_url, function(err, db){
		if (err) throw err;
		req_obj.db_opt_callback(db, req_obj)
    });
}

// user management
exports.user_find_one = function(db, req_obj){
	var collection = db.collection("user");
    collection.findOne(req_obj.qry_obj, function(err, usr){
    	req_obj.io_callback(err, usr, req_obj);
    });
}

// memo 
exports.memo_find_one = function(db, req_obj){
	var collection = db.collection("memo");
    collection.findOne(req_obj.qry_obj, function(err, result){
    	db.close();
    	req_obj.db_results = {data: result}
    	req_obj.io_callback(req_obj);
    });
}
exports.memo_find_all = function(db, req_obj){
	var collection = db.collection("memo");
    collection.find(req_obj.qry_obj).toArray(function(err, result){
    	db.close();
    	req_obj.db_results = {data: result}
    	req_obj.io_callback(req_obj);
    });
}
exports.memo_insert_one = function(db, req_obj){
	var collection = db.collection("memo");
    collection.insert(req_obj.qry_obj, {w:1}, function(err, objects){
    	if (err) console.warm(err.message);
		if (err && err.message.indexOf('E11000 ') !== -1){
	    	// this _id was already inserted in the database
		}
		db.close();
		// to redirect back to correct message 
    	req_obj.db_results = {data: objects}
    	req_obj.io_callback(req_obj);
    });
}