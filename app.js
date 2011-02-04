var http				= require("http");
var mongoose		= require("./lib/mongoose/lib/mongoose");
var express			= require("express");

var Schema			= mongoose.Schema;
var ObjectId		= Schema.ObjectId;

var db_host			= "127.0.0.1";
var db_name			= "mongee-dev";
var app_version	= "0.0.1";
var app_port		= 3000;

var app 				= express.createServer();
var db					= mongoose.connect("mongodb://" + db_host + "/" + db_name);

var func				= require("./func");


app.configure(function(){
	app.use(express.staticProvider(__dirname + '/public'));
	app.use(express.bodyDecoder());
	app.use(express.methodOverride());
});

/*
* models
*
* all the model imports and mongoose mappings and stuff
*
*/
mongoose.model("User", require("./models/user").User);
mongoose.model("Post", require("./models/post").Post);
mongoose.model("Comment", require("./models/comment").Comment);

var User		= mongoose.model("User");
var Post 		= mongoose.model("Post");
var Comment = mongoose.model("Comment");


/*
* mapping
*
* put all the mapping stuff below here
*
*/
app.get("/", function(req, res){
	res.send("wut -- man this is forbidden", 403);
});

app.put("/user/new", function(req, res){
	var user = new User();
	
	for(var key in req.body.user) {
		user.doc[key] = req.body.user[key];
	}
	
	user.save(function(err){
		if(!err) {
			res.send(stringify(user), 200);
		} else {
			res.send(err.message, 403);
		}
	});
});

app.get("/user/get/:user_id", function(req, res){
	User.findOne({_id : req.params.user_id}, function(error, user){
		if(user) {
			res.send(stringify(user), 200);
		} else {
			res.send("no user found", 404);
		}
	});
});

app.post("/user/sign_in", function(req, res){
	var u = null;
	
	User.findOne({mail : req.body.user.mail}, function(error, user){
		console.log("user " + user.mail + " logging in");
		if(user) {
			if(user.password == req.params.user_password) {
				console.log("-- success, logged in now");
				res.send(stringify(user), 200);
			} else {
				console.log("-- failed, password incorrect");
				res.send("password is not correct", 403);
			}
		} else {
			console.log("-- failed, no such user");
			res.send("no user with that mail found", 404);
		}
	});
});

app.put("/post/new", function(req, res){
	handle_authorized_request(req, res, function(req, res, user){
		var post = new Post();
		
		for(var key in req.body.post) {
			post.doc[key] = req.body.post[key];
		}
		
		post.save(function(err){
			if(!err) {
				res.send(stringify(post), 200);
			} else {
				res.send(err.message, 500);
			}
		});
	});
});

/*
* start the server and listen
*/
app.listen(app_port);
console.log("mongee version " + app_version + " now running on port " + app_port);
console.log("");

/*
* private functions
*
* write all your private functions below here
*/


function stringify(o) {
	return JSON.stringify(o);
}

function handle_authorized_request(req, res, fn) {
	var user_id = null;
	var user_password = null;
	
	var auth = get_credentials_from_request(req.headers['authorization']);
	if(auth) {
		user_id = auth.id;
		user_password = auth.password;
		
		User.findOne({_id : user_id, password : user_password}, function(error, user){
			if(user) {
				fn(req, res, user);
			} else {
				res.send("somethings wrong with your credentials...", 403);
			}
		});
	} else {
		res.send("not authorized, please login first", 403);
	}
	
	/*
	allows you to do requests like this:
	function get('/whatever', function(req, res) {
		handle_authorized_request(req, res, function(req, res, user) {
			res.send("disco disco");
		});
	});
	*/
}

function get_credentials_from_request(header_value) {
	var value;
  if (value = header_value.match("^Basic\\s([A-Za-z0-9+/=]+)$")) {
  	var auth = (new Buffer(value[1] || "", "base64")).toString("ascii");
  	return {
    	id : auth.slice(0, auth.indexOf(':')),
    	password : auth.slice(auth.indexOf(':') + 1, auth.length)
  	};
  } else {
  	return null;
  }
}

function decode_base64(string) {
	return (new Buffer(string, "base64").toString("ascii"))
}