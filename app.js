var http			= require("http");
var fs				= require("fs");
var mongoose		= require("mongoose");
var express			= require("express");
var controller		= require("./util/controller");
var nodemailer		= require("nodemailer");

var Schema			= mongoose.Schema;
var ObjectId		= Schema.ObjectId;

var db_host			= "127.0.0.1";
var db_name			= "mongee-dev";
var app_version		= "0.0.1";
var app_port		= 3000;

var app 			= express();
var db				= mongoose.connect("mongodb://" + db_host + "/" + db_name);

/*
* models
*
* all the model imports and mongoose mappings and stuff
*
*/
mongoose.model("User", require("./models/user").User);
mongoose.model("Comment", require("./models/comment").Comment);
mongoose.model("Post", require("./models/post").Post);
mongoose.model("Photo", require("./models/photo").Photo);
//mongoose.model("Album", require("./models/album").Album);


app.configure(function(){
	app.use(express.logger({ format: ':method :url :status' }));
	app.use("/", express.static(__dirname + "/public"));
	app.use(express.methodOverride());
	app.use(express.bodyParser());
	app.use(express.cookieParser());

	var engines = require('consolidate');
	app.engine('html', engines.hogan);
	
	controller.bootControllers(app);

	app.get("/welcome", function(req, res) {
		res.render(__dirname + "/views/welcome.html");
	})

	app.get("/", function(req, res) {
		if(req.cookies && req.cookies.user) {
			res.render(__dirname + "/views/index.html");
		} else {
			res.redirect("/welcome");
		}
	})
	
	console.log("mongee version " + app_version + " now running on port " + app_port);
});


app.listen(app_port);