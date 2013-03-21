var mongoose		= require("mongoose");

var Schema			= mongoose.Schema;
var ObjectId		= Schema.ObjectId;

var Comment = new Schema({
	user 		: ObjectId,
	content	: String
});

exports.Comment = Comment;