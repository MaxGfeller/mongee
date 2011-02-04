var mongoose		= require("../lib/mongoose/lib/mongoose");

var Schema			= mongoose.Schema;
var ObjectId		= Schema.ObjectId;


var Post = new Schema({
	user				: ObjectId,
	on_wall			: [ObjectId],
	content			: String, 
	link		 		: String,
	comment			: [ObjectId]
});

exports.Post = Post;