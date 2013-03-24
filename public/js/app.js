(function($) {
	"use strict";

	var User = Backbone.Model.extend({
		name: null,
		firstName: null,
		birthDate: null,
		latestPost: null,
		currentStatus: null,
		posts: null,

		urlRoot: "/users/me",

		postSomething: function(postModel) {
			var self = this;

			var loggedInUser = $.localStorage('loggedInUser');//$.parseJSON($.cookie("user"));

			$.ajax({
				url: "/posts",
				type: "put",
				data: {content: postModel.attributes.content, firstName: postModel.attributes.firstName, lastName: postModel.attributes.lastName}
			}).done(function() {
				self.set("latestPost", postModel.get("date"));
				self.get("posts").add(postModel);
			});
		},

		getFriendProposals: function(cb) {
			$.ajax({
				url: "users/friend_proposals",
				type: "get"
			}).done(function(data) {
				cb($.parseJSON(data));
			});
		},

		getUserById: function(id, cb) {
			$.ajax({
				url: "users/" + id,
				type: "get"
			}).done(function(data) {
				cb($.parseJSON(data));
			});
		}
	});

	var Users = Backbone.Collection.extend({
		url: "users"
	});

	var Post = Backbone.Model.extend({
		url: "posts"
	});

	var Posts = Backbone.Collection.extend({
		model: Post,
		url: "posts/wall",
		initialize: function(models, options) {
			this.bind("add", options.view.addPostToStream);
		}
	});

	var NewsView = Backbone.View.extend({
		el: $("#news-view"),
		initialize: function() {

		},
		addPostToStream: function(model) {
			// $("#posts-body").append(model.get("content"));
			$("#posts-body").prepend("<div id=\"post-entry\"><i class=\"icon-th-large\" />&nbsp;&nbsp;<b>" + model.get("firstName") + " " + model.get("lastName") + "</b><br>" + model.get("content") + "<br><span class=\"date\">" + model.get("created_at") + "</span><div id=\"posts-addendum\"><a href=\"#\"><i class=\"icon-ok\"></i> Gfellt</a></div></div>");
		}
	});

	var FriendProposalsView = Backbone.View.extend({
		el: $('#friends-container'),
		initialize: function(userModel) {
			console.log('loading friend proposals');

			this.user = userModel;
			this.render();
		},
		render: function() {
			this.user.getFriendProposals(function(data) {
				// console.log(data);
				var tmplMarkup = $("#tmpl-friends-proposal").html();
				var compiledTmpl = _.template(tmplMarkup, {users: data});
				$('#friends-container').append(compiledTmpl);
			});
		}
	});

	var AppView = Backbone.View.extend({
		el: $("body"),
		user: null,
		initialize: function(userModel) {
			console.log("initializing mongee app");

			this.user = userModel;
			this.user.set("posts", new Posts(null, { view: this }));

			this.render();
		},
		render: function() {
			// set the status
			var currentStatus = this.user.get("currentStatus");

			if(currentStatus === null)
				currentStatus = "<span style='color: grey'>click to edit status</span>";

			$("#current-user-status").html(currentStatus);
		},
		events: {
			"click #submit-new-post": function() {
				var loggedInUser = $.localStorage('loggedInUser');//eval("(" + $.cookie("user").substring(2) + ")");
				var new_post = $("#new-post").val().trim();
				var post_date = new Date();

				// clear field
				$("#new-post").val("");

				// cancel if user has entered nothing
				if(new_post === "")
					return;

				var newPost = new Post();
				//newPost.set({ date: new Date(), content: '<div id="post-entry"><i class="icon-th-large" />&nbsp;&nbsp;&nbsp;<b>Max</b><br>' + new_post + ' <span class="date">am ' + post_date +'</span><div id="posts-addendum"><a href="#">i like</a> </div></div>' });

				newPost.set({ date: new Date(), content: new_post, firstName: loggedInUser.firstName, lastName: loggedInUser.lastName });

				this.user.postSomething(newPost);

			},

			"click #current-user-status": function() {
				if(($("#current-user-status").html().indexOf("<input") === -1)) {
					$("#current-user-status").html("<input type='text' id='new-status' value='" + (this.user.get("currentStatus") === null ? "" : this.user.get("currentStatus")) + "'' /><button id='update-status-update'>update status</button><button id='cancel-status-update'>cancel</button>");
				}
			},

			"click #update-status-update": function() {
				var new_status = $("#new-status").val();

				this.user.set("currentStatus", new_status);

				$("#current-user-status").html(new_status); // does not work?
				document.getElementById("current-user-status").innerHtml = new_status;
			},

			"click #cancel-status-update": function() {
				$('#current-user-status *').remove();
				$("#current-user-status").html(this.user.get("currentStatus"));
			}
		}
	});

	// create app router
	var AppRouter = Backbone.Router.extend({
		routes: {
			"profile": "profileRoute",
			"profile/:id": "profileRoute",
			"news": "newsRoute",
			"": "newsRoute"
		},

		newsRoute: function() {
			// fetch posts
			console.log("clear");
			$("#posts-body").html("");
			var newsView = new NewsView();

			var posts = new Posts(null, {view: newsView});
			posts.fetch({
				success: function(posts) {
					for(var i = 0; i <= posts.models.length; i++) {
						var post = posts.models[i];
						if(post !== undefined) {
							newsView.addPostToStream(post);
						}
					}
				}
			});
		},

		profileRoute: function(id) {
			// load user info
			var users = new Users();


			var renderView = function(data) {
				var tmplMarkup = $("#tmpl-profile").html();
				var compiledTmpl = _.template(tmplMarkup, {user: data});

				$("#posts-body *").html("");
				$("#posts-body").html(compiledTmpl);
			};

			if(id) {
				var user = new User();
				user.getUserById(id, function(data) {
					renderView(data);
				});
			} else {
				console.debug('logged in user', loggedInUser);
				renderView(loggedInUser);
			}
		}
	});

	// initialize router
	var router = new AppRouter();
	Backbone.history.start();

	// initialize model and view
	var userModel = new User({ firstName: "Max", name: "Gfeller" });
	var appView = new AppView(userModel);
	var friendProposalsView = new FriendProposalsView(userModel);

	$.localStorage('loggedInUser', eval("(" + $.cookie("user").substring(2) + ")"));//eval("(" + $.cookie("user").substring(2) + ")");
	var loggedInUser = $.localStorage('loggedInUser');

	$("#username").html(loggedInUser.firstName + " " + loggedInUser.lastName);

	$(document).ready(function() {

	});

})(jQuery);