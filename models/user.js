var mongoose		= require("mongoose");

var Schema			= mongoose.Schema;
var ObjectId		= Schema.ObjectId;

var User = new Schema({
	email			: {type : String, index : true, required : true, safe : true},
	lastName		: String,
	firstName		: String, 
	password 		: String,
	birthday		: String,
	createdAt		: {type : Date, default: Date.now},
	friends			: [ObjectId],
	state			: {type: String, default: "notVerified"}
});

User.path("lastName").set(function(v){
	return v.capitalize();
});

User.path("firstName").set(function(v){
	return v.capitalize();
});

String.prototype.capitalize = function(){ 
    return this.replace(/\w+/g, function(a){
        return a.charAt(0).toUpperCase() + a.substr(1).toLowerCase();
    });
};

exports.User = User;