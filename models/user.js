var mongoose		= require("../lib/mongoose/lib/mongoose");

var Schema			= mongoose.Schema;
var ObjectId		= Schema.ObjectId;


var User = new Schema({
	mail			: String,
	name 			: String,
	prename		: String, 
	password 	: String,
	birthday	: String
});

User.pre("save", function(next){
	mongoose.model("User", require("./user").User)
	console.log("creating new user " + this.get("mail"));
	mongoose.model("User").find({mail : this.get("mail")}, function(error, user){
		if(user && user.length > 0) {
			console.log("-- failed (mail adress already in use)");
			next(new Error("a user with that mail already exists man... dont fuck with me!!!"));
		} else {
			console.log("-- success!");
			this.set("created_at", new Date());
			next();
		}
	});
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