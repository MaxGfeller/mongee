var mongoose		= require("../lib/mongoose/lib/mongoose");

var User = mongoose.model("User");
var auth = require("../util/authorized_controller");

module.exports = {
	
	mapping: {
		"index" 	: {"url":"/users", "method":"get"},
		"create"	: {"url":"/users", "method":"put"},
		"read"		: {"url":"/users/:id", "method":"get"},
		"update"	: {"url":"/users", "method":"post"},
		"delete"	: {"url":"/me", "method":"delete"}, 
		"sign_in"	: {"url":"/users/sign_in", "method":"post"}
	},
	
	// GET /users
	index: function(req, res) {
		User.find({}, function(error, users){
			res.send(users);
		});
	}, 
	
	// GET /users/:id
	read: function(req, res) {
		User.findOne({_id : req.params.id}, function(error, user){
			if(error) {
				res.send("no user found", 404);
			} else {
				res.send(JSON.stringify(user), 200);
			}
		});
	}, 
	
	// POST /users
	update: function(req, res) {
		User.findOne({_id : req.body.user.id}, function(error, user){
			if(error) {
				res.send("problem occured", 404);
			} else {
				for(var key in req.body.user) {
					user.doc[key] = req.body.user[key];
				}
				user.save(function(err){
					if(err) {
						res.send(err.message, 500);
					} else {
						res.send("ok", 200);
					}
				});
			}
		});
	}, 
	
	// PUT /users
	create: function(req, res) {
		var user = new User();
	
		for(var key in req.body.user) {
			user.doc[key] = req.body.user[key];
		}
		
		user.save(function(err){
			if(!err) {
				res.send(JSON.stringify(user), 200);
			} else {
				res.send(err.message, 403);
			}
		});
	}, 
	
	// DELETE /users/:id
	delete: function(req, res) {
		auth.handle_authorized_request(req, res, function(req, res, user){
			User.findOne({_id : user._id, mail : user.mail, password : user.password}, function(error, user){
				if(!error) {
					console.log("deleting user " + user.mail + " now");
				} else {
					res.send("fail", 500);
				}
			});
		});
	}, 
	
	// POST /users/sign_in
	sign_in: function(req, res) {
		var u = null;
	
		if(req.body.user.mail && req.body.user.password) {
			User.findOne({mail : req.body.user.mail}, function(error, user){
				console.log("user " + user.mail + " logging in");
				if(user) {
					console.log("actual pw: " + user.password + " vs submitted password: " + req.body.user.password);
					if(user.password == req.body.user.password) {
						console.log("-- success, logged in now");
						res.send(JSON.stringify(user), 200);
					} else {
						console.log("-- failed, password incorrect");
						res.send("password is not correct", 401);
					}
				} else {
					console.log("-- failed, no such user");
					res.send("no user with that mail found", 404);
				}
			});
		} else {
			console.log("de scheller failt widrmol...");
			res.send("fail", 500);
		}
	}
	
}