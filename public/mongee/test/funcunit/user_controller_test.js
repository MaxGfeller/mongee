/*global module: true, ok: true, equals: true, S: true, test: true */
module("user", {
	setup: function () {
		// open the page
		S.open("//mongee/mongee.html");

		//make sure there's at least one user on the page before running a test
		S('.user').exists();
	},
	//a helper function that creates a user
	create: function () {
		S("[name=name]").type("Ice");
		S("[name=description]").type("Cold Water");
		S("[type=submit]").click();
		S('.user:nth-child(2)').exists();
	}
});

test("users present", function () {
	ok(S('.user').size() >= 1, "There is at least one user");
});

test("create users", function () {

	this.create();

	S(function () {
		ok(S('.user:nth-child(2) td:first').text().match(/Ice/), "Typed Ice");
	});
});

test("edit users", function () {

	this.create();

	S('.user:nth-child(2) a.edit').click();
	S(".user input[name=name]").type(" Water");
	S(".user input[name=description]").type("\b\b\b\b\bTap Water");
	S(".update").click();
	S('.user:nth-child(2) .edit').exists(function () {

		ok(S('.user:nth-child(2) td:first').text().match(/Ice Water/), "Typed Ice Water");

		ok(S('.user:nth-child(2) td:nth-child(2)').text().match(/Cold Tap Water/), "Typed Cold Tap Water");
	});
});

test("destroy", function () {

	this.create();

	S(".user:nth-child(2) .destroy").click();

	//makes the next confirmation return true
	S.confirm(true);

	S('.user:nth-child(2)').missing(function () {
		ok("destroyed");
	});

});