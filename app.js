var http				= require("http");
var fs					= require("fs");
var mongoose		= require("./lib/mongoose/lib/mongoose");
var express			= require("express");
var controller	= require("./util/controller");

var Schema			= mongoose.Schema;
var ObjectId		= Schema.ObjectId;

var db_host			= "127.0.0.1";
var db_name			= "mongee-dev";
var app_version	= "0.0.1";
var app_port		= 3000;

var app 				= express.createServer();
var db					= mongoose.connect("mongodb://" + db_host + "/" + db_name);

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


app.configure(function(){
	app.use(express.logger({ format: ':method :url :status' }));
	app.use(express.staticProvider(__dirname + '/public'));
	app.use(express.bodyDecoder());
	app.use(express.methodOverride());
	
	controller.bootControllers(app);
});


app.listen(app_port);
console.log("mongee version " + app_version + " now running on port " + app_port);