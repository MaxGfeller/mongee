var mongoose		= require("../lib/mongoose/lib/mongoose");

var Schema			= mongoose.Schema;
var ObjectId		= Schema.ObjectId;

var Comment 		= mongoose.model("Comment");

var Post = new Schema({
	user				: ObjectId,
	on_wall			: [ObjectId],
	content			: String, 
	link		 		: String,
	comment			: [Comment],
	created_at	:	{type : Date, default : Date.now}
});

exports.Post = Post;