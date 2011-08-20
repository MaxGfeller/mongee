var mongoose		= require("mongoose");

var Post 			= mongoose.model("Post");
var Comment 		= mongoose.model("Comment");
var auth 			= require("../util/authorized_controller");

module.exports = {
	
	mapping: {
		"create"				: {
			"url":"/posts",
			"method":"put",
			"description":"create a new post",
			"auth":true
		},
		"get_my_posts"	: {
			"url":"/posts",
			"method":"get",
			"description":"get posts written by yourself",
			"auth":true
		}, 
		"get_posts_on_my_wall" : {
			"url":"/posts/wall",
			"method":"get",
			"description":"get all the posts on your own wall",
			"auth":true
		}, 
		"get_posts_on_wall" : {
			"url":"/posts/wall/:id",
			"method":"get",
			"description":"get all the posts on the wall of a given user",
			"auth":true
		},
		"add_comment" : {
			"url":"/posts/:id/add_comment",
			"method":"put",
			"description":"add a comment to an existing post",
			"auth":true
		}
	}, 
	
	// PUT /posts
	create : function(req, res) {
		auth.handle_authorized_request(req, res, function(req, res, user){
			var post = new Post();
			
			for(var key in req.body.post) {
				post.doc[key] = req.body.post[key];
			}
			
			post.doc["user"] = user.get("_id");
			
			post.save(function(err){
				if(!err) {
					res.send(JSON.stringify(post), 200);
				} else {
					res.send(err.message, 403);
				}
			});
		});
	},
	
	// GET /posts
	get_my_posts : function(req, res) {
		auth.handle_authorized_request(req, res, function(req, res, user) {
			Post.find({user : user.get('_id')}, function(err, posts){
				if(posts) {
					res.send(JSON.stringify(posts), 200);
				} else {
					res.send("no posts found", 404);
				}
			});
		});
	}, 
	
	// GET /posts/wall
	get_posts_on_my_wall : function(req, res) {
		auth.handle_authorized_request(req, res, function(req, res, user){
			Post.find({$or: [{on_wall : user.get("_id")}, {user : user.get("_id")}]}, function(err, posts){
				if(posts) {
					res.send(JSON.stringify(posts), 200);
				} else {
					res.send("no posts found", 404);
				}
			});
		});
	}, 
	
	// GET /posts/wall/:id
	get_posts_on_wall : function(req, res) {
		Post.find({$or: [{on_wall : req.params.id}, {user : req.params.id}]}, function(err, posts){
			if(posts) {
				res.send(JSON.stringify(posts), 200);
			} else {
				res.send("no posts found", 404);
			}
		});
	}, 
	
	// PUT /posts/:id/add_comment
	add_comment : function(req, res) {
		auth.handle_authorized_request(req, res, function(req, res, user){
			Post.findOne({_id : req.params.id}, function(err, post){
				if(post) {
					var comment = new Comment();
					comment.set("user", req.body.comment["user"]);
					comment.set("content", req.body.comment["content"]);
					
					post.comments.push(comment);
					
					post.save(function(err){
						if(!err) {
							res.send("ok", 200);
						} else {
							res.send(err.message, 500);
						}
					});
				} else {
					res.send("no post with that id found", 404);
				}
			});
		});
	}
}