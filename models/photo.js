var mongoose		= require("mongoose");

var Schema			= mongoose.Schema;
var ObjectId		= Schema.ObjectId;

var Comment 		= mongoose.model("Comment");

var MarkOnPhoto = new Schema({
	user				: ObjectId,
	pos_x				: Number,
	pos_y				: Number
});

mongoose.model("MarkOnPhoto", MarkOnPhoto);

var Photo = new Schema({
	user 				: ObjectId,
	filename		: String,
	description : String,
	comments		: [Comment],
	marks				: [MarkOnPhoto],
	created_at	:	{type : Date, default : Date.now}
});

exports.Photo = Photo;