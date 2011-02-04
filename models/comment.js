var mongoose		= require("../lib/mongoose/lib/mongoose");

var Schema			= mongoose.Schema;
var ObjectId		= Schema.ObjectId;

var Comment = new Schema({
	user 		: ObjectId,
	content	: String
});

exports.Comment = Comment;