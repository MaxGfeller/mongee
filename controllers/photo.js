var mongoose		= require("mongoose");
var formidable  = require("formidable");
var util 				= require("util");
var fs					= require("fs");

var User = mongoose.model("User");
var Photo = mongoose.model("Photo");
var auth = require("../util/authorized_controller");

module.exports = {
	
	mapping: {
		"create" : {
			"url":"/photos/:album?",
			"method":"post",
			"description":"upload one or multiple images",
			"auth":true
		}
	}, 
	
	// PUT /photos/:album?
	create: function(req, res) {
		auth.handle_authorized_request(req, res, function(req, res, user){
			var form = new formidable.IncomingForm();
      var files = [];
      var fields = [];

			var path = "public/photos/" + user._id.toString();
			if(req.params.album) {
				path += "/" + req.params.album;
			}

			
			fs.mkdir(path, 0777);
    	form.uploadDir = path;
	    form.parse(req);
	    form.addListener("file", function(field, file){
	    	var ext = /[^.]+$/.exec(file.name);
	    	var newFileName = "photo_" + user._id.toString() + "_" + new Date().getTime() + "." + ext;
	    	fs.rename(file.path, path + "/" + newFileName);
	    	res.send(newFileName, 200);
	    });
		});
	}
}