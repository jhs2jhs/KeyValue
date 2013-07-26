var io = require("./io.js");
var myutil = require("./myutil.js");

/*
 *
memo = {
	action = get | put | update | delete

}
*/

exports.main = function(req, res){
	var req_obj = {};
	req_obj = {req:req, res:res};
	req_obj.action = req.param("action");
	req_obj.memo = {};
	switch (req_obj.action) {
		case 'get_all': 
			return memo_get_all(req_obj);
		case 'get': 
			return memo_get(req_obj);
		case 'put':
			req_obj.memo.key = req.param("key");
			req_obj.memo.value = req.param("value");
			req_obj.memo.desc = req.param("desc");
			req_obj.memo.tags = req.param("tags");
			req_obj.memo.attachs = req.param("attachs");
			return memo_put(req_obj);
	}
};

//
function memo_get_all(req_obj){
	req_obj.qry_obj = {author_id:req_obj.req.user._id.toString()};
	req_obj.callback = memo_get_all_cp;
	return io.memo_get_all(req_obj);
}
function memo_get_all_cp(req_obj){
	myutil.debug( req_obj.qry_obj);
	myutil.debug(req_obj.db_results);
	myutil.debug("hello");
	req_obj.res.send(req_obj.db_results);
}

//
function memo_get(req_obj){
	req_obj.qry_obj = {author_id:req_obj.req.user._id.toString()};
	req_obj.callback = memo_get_cp;
	return io.memo_get_single(req_obj);
}
function memo_get_cp(req_obj){
	myutil.debug( req_obj.qry_obj);
	myutil.debug(req_obj.db_results);
	myutil.debug("hello");
	req_obj.res.send("hello world memo", req_obj.db_results);
}

//
function memo_put(req_obj){
	req_obj.qry_obj = {
		ref_id: "",
		key: req_obj.memo.key,
		value: req_obj.memo.value,
		desc: req_obj.memo.desc,
		tags: req_obj.memo.tags,
		attachs: req_obj.memo.attachs,
		author_id:req_obj.req.user._id.toString(), 
		create_date: new Date(), 
		update_date: new Date()
	};
	req_obj.callback = memo_get_cp;
	return io.memo_put_single(req_obj);
}
function memo_put_cp(req_obj){
	myutil.debug( req_obj.qry_obj);
	myutil.debug(req_obj.db_results);
	myutil.debug("hello");
	req_obj.res.send("hello world memo", req_obj.db_results);
}