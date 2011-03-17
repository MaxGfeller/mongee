var mongoose		= require("mongoose");

var Schema			= mongoose.Schema;
var ObjectId		= Schema.ObjectId;

var User = new Schema({
	mail			: {type : String, index : true, required : true, safe : true},
	name 			: String,
	prename		: String, 
	password 	: String,
	birthday	: String,
	created_at:	{type : Date, default : Date.now},
	friends		: [ObjectId]
});

User.path("name").set(function(v){
	return v.capitalize();
});

User.path("prename").set(function(v){
	return v.capitalize();
});

String.prototype.capitalize = function(){ 
    return this.replace(/\w+/g, function(a){
        return a.charAt(0).toUpperCase() + a.substr(1).toLowerCase();
    });
};

exports.User = User;