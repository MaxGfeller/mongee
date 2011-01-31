var http				= require("http");
var mongoose		= require("./lib/mongoose/lib/mongoose");
var express			= require("express");

var Schema			= mongoose.Schema;
var ObjectId		= Schema.ObjectId;

var app 				= express.createServer();
var db					= mongoose.connect("mongodb://127.0.0.1/mongee-dev");

var app_version	= "0.0.1";
var app_port		= 3000;


app.configure(function(){
	app.use(express.staticProvider(__dirname + '/public'));
	app.use(express.bodyDecoder());
});


/*
* schema definitions
*/
var Mongee_User = new Schema({
	mail			: String,
	name 			: String,
	prename		: String, 
	password 	: String,
	birthday	: String
});

mongoose.model("User", Mongee_User);
var User = mongoose.model("User");

/*
* mapping
*/
app.get("/", function(req, res){
	res.send("wut -- man this is forbidden", 403);
});

app.get("/user/new/:user_mail__64/:user_name/:user_prename/:user_password/:user_birthday?", function(req, res){
	var u = new User();
	u.mail = decode_base64(req.params.user_mail__64);
	u.name = req.params.user_name;
	u.prename = req.params.user_prename;
	u.password = req.params.user_password;
	u.birthday = req.params.user_birthday;
	
	u.save(function(){
		res.send(stringify(u), 200);
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

app.get("/user/sign_in/:user_mail__64/:user_password", function(req, res){
	var u = null;
	
	User.findOne({mail : decode_base64(req.params.user_mail__64)}, function(error, user){
		if(user) {
			if(user.password == req.params.user_password) {
				res.send(stringify(user), 200);
			} else {
				res.send("password is not correct", 403);
			}
		} else {
			res.send("no user with that mail found", 404);
		}
	});
});

/*
* start the server and listen
*/
app.listen(app_port);
console.log("mongee version " + app_version + " now running on port " + app_port);

/*
* private functions
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
				fn(req, res);
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
		handle_authorized_request(req, res, function(req, res) {
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