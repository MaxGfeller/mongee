var mongoose		= require("mongoose");
var formidable  	= require("formidable");
var util 			= require("util");
var fs				= require("fs");

var User 			= mongoose.model("User");
var Photo 			= mongoose.model("Photo");
//var Album 			= mongoose.model("Album");

var auth = require("../util/authorized_controller");


module.exports = {
	
	mapping: {
		"create_photo" : {
			"url":"/photos/:album?",
			"method":"post",
			"description":"upload one or multiple images",
			"auth":true
		}, 
		"create_album" : {
			"url":"/albums", 
			"method":"put",
			"description":"create a new photo album",
			"auth":true
		}
	}, 
	
	// PUT /photos/:album?
	create_photo: function(req, res) {
		auth.handle_authorized_request(req, res, function(req, res, user){
			var form = new formidable.IncomingForm();
              var files = [];
              var fields = [];
  

			var path = "public/photos/" + user._id.toString();

			
			fs.mkdir(path, 0777);
           	form.uploadDir = path;
      	    form.parse(req);
      
      	    form.addListener("file", function(field, file){
      
      	    	var ext = /[^.]+$/.exec(file.name);
      
      	    	var newFileName = "photo_" + user._id.toString() + "_" + new Date().getTime() + "." + ext;
      
      	    	fs.rename(file.path, path + "/" + newFileName);
      
      	    	
      
      	    	var photo = new Photo();
      
      	    	photo.set("user", user.get("_id"));
      
      	    	photo.set("filename", newFileName);
      
	    	
	    	if(album_id = req.params.album) {
	    		Album.findOne({_id : album_id}, function(err, album){
	    			if(err) return;
	    			album.photos.push(photo);
	    			album.save(function(err){
	    				if(!err) {
	    					res.send(JSON.stringify(photo), 200);
	    				} else {
	    					res.send("failed to save photo in album", 500);
	    				}
	    			});
	    		});
	    	} else {
		    	photo.save(function(err){
		    		if(!err) {
		    			res.send(JSON.stringify(photo), 200);
		    		} else {
		    			res.send("failed to save photo", 500);
		    		}
		    	});
		    }
	    });
		});
	}, 
	
	// PUT /albums
	create_album: function(req, res) {
		auth.handle_authorized_request(req, res, function(req, res, user){
			var album = new Album();
			
			album.set("user", user.get("_id"));
			album.set("title", req.body.album["title"]);
			album.set("description", req.body.album["description"]);
			
			album.save(function(err){
				if(!err) {
					res.send(JSON.stringify(album), 200);
				} else {
					res.send("save album failed", 500);
				}
			});
		});
	}
}