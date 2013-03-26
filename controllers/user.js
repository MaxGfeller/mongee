var mongoose = require("mongoose");
var nodemailer = require("nodemailer");

var User = mongoose.model("User");
var auth = require("../util/authorized_controller");

function classify(arg) {
	return Object.prototype.toString.call(arg);
}

String.prototype.capitalize = function(){
    return this.replace(/\w+/g, function(a){
        return a.charAt(0).toUpperCase() + a.substr(1).toLowerCase();
    });
};

module.exports = {

	mapping: {
		"index" : {
			"url":"/users",
			"method":"get",
			"description":"retrieve all registered users",
			"auth":false
		},
		"get_my_friends" : {
			"url":"/users/my/friends",
			"method":"get",
			"description":"get all your friends",
			"auth":true
		},
		"read" : {
			"url":"/users/:id",
			"method":"get",
			"description":"NEEDS TO BE UPDATED get a single user by id",
			"auth":false
		},
		"update" : {
			"url":"/users",
			"method":"post",
			"description":"NEEDS TO BE UPDATED update a given user",
			"auth":false
		},
		"verify" : {
			"url": "/users/verify/:id",
			"method": "get",
			"description": "Verify your email adress",
			"auth": false
		},
		"delete" : {
			"url":"/me",
			"method":"delete",
			"description":"delete your own user, attention: cant be undone",
			"auth":true
		},
		"sign_in" : {
			"url":"/users/sign_in", 
			"method":"post",
			"description":"sign yourself in",
			"auth":false
		},
		"add_friend" : {
			"url":"/users/add_friend/:user_id", 
			"method":"post",
			"description":"add a friend by user_id",
			"auth":true
		}, 
		"find_users" : {
			"url":"/users/find/:param",
			"method":"get",
			"description":"find users whose name or prename start with the given param",
			"auth":true
		},
		"get_friend_proposals": {
			"url":"/users/friend_proposals",
			"method":"get",
			"description":"find users that you could add as friend",
			"auth":true
		}
	},
	
	// GET /users
	index: function(req, res) {
		User.find({}, function(error, users){
			res.send(users);
		});
	}, 
	
	// GET /users/verify/:id
	verify: function(req, res) {
		User.findOne({_id: req.params.id}, function(error, user) {
			if(error) {
				res.send("There was an error", 404);
			} else {
				user.state = "verified";

				user.save(function(err) {
					if(err) {
						res.send("There was an error", 500);
					}

					res.send("Awesome!");
				});
			}
		})
	},

	// POST /users
	update: function(req, res) {
		User.findOne({_id : req.body.user.id}, function(error, user){
			if(error) {

				var user = new User();

				user.firstName 	= req.body.user.firstName;
				user.lastName 	= req.body.user.lastName;
				user.username 	= req.body.user.username;
				user.email 		= req.body.user.email;
				user.password 	= req.body.user.password;

				user.save(function(err){
					if(!err) {
						// Send mail
						var transport = nodemailer.createTransport("SMTP", {
						    service: "Gmail",
						    auth: {
						        user: "max.gfeller@gmail.com",
						        pass: "************"
						    }
						});
						transport.sendMail({
							from: "'Mongee'<max.gfeller@gmail.com>",
							to: user.email,
							subject: "Deine Registrierung bei Mongee",
							text: "Bitte bestätige deine Email Adresse: http://localhost:3000/users/verify/" + user._id 
						}, function() {
							res.send(JSON.stringify(user), 200);
						});
					} else {
						res.send(err.message, 403);
					}
				});
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
	
	// DELETE /users/:id
	delete: function(req, res) {
		auth.handle_authorized_request(req, res, function(req, res, user){
			User.findOne({_id : user._id, mail : user.mail, password : user.password}, function(error, user){
				if(!error) {
					console.log("deleting user " + user.get("mail") + " now");
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
			console.log(req.body.user.mail);
			User.findOne({email : req.body.user.mail}, function(error, user){
				if(error) 
					console.log(error);
				if(user) {
					if(user.password == req.body.user.password) {
						res.cookie("user", user);

						res.redirect("/");
					} else {
						res.send("password is not correct", 401);
					}
				} else {
					res.send("no user with that mail found", 404);
				}
			});
		} else {
			console.log("no credentials submitted");
			res.send("fail", 500);
		}
	}, 
	
	// POST /users/add_friend/:user_id
	add_friend: function(req, res) {
		auth.handle_authorized_request(req, res, function(req, res, user){
			var objectId = req.params.user_id;
			
			user.friends.push(objectId);
			user.save(function(err){
				if(err) {
					res.send("some error occured", 500);
				} else {
					res.send("ok", 200);
				}
			});
		});
	},
	
	// GET /users/my/friends
	get_my_friends: function(req, res) {
		auth.handle_authorized_request(req, res, function(req, res, user){
			var friends = user.get("friends");

			User.find({_id : { $in: friends}}, function(err, friends){
				if(friends) {
					res.send(JSON.stringify(friends), 200);
				} else {
					res.send("you have no friends", 404);
				}
			});
		});
	},
	
	// GET /users/find/:param
	find_users: function(req, res) {
		auth.handle_authorized_request(req, res, function(req, res, user){
			var reg = new RegExp("^" + req.params.param.capitalize());
			User.find({$or: [{name : reg}, {prename : reg}]}, function(err, users){
				if(users) {
					res.send(JSON.stringify(users), 200);
				} else {
					res.send("no users found", 404);
				}
			});
		});
	},

	// GET /users/friend_proposals
	get_friend_proposals: function(req, res) {
		auth.handle_authorized_request(req, res, function(req, res, user){
			User.find({}, function(err, users){
				if(users) {
					console.log(user);
					// TODO: filter friends
					for(var i = 0; i < users.length; i++) {
						var u = users[i];
						
						if(u._id.toString() === user._id.toString()) {
							delete users[i];
						}
					}
					res.send(JSON.stringify(users), 200);
				} else {
					res.send("no users found", 404);
				}
			});
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
	}
}