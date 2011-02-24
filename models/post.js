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
	created_at	: Date
});

Post.pre("save", function(next){
	this.set("created_at", new Date());
	next();
});

exports.Post = Post;