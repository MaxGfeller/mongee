require.paths.unshift('vendor/mongoose');
var mongoose = require('mongoose').Mongoose;

mongoose.model("User", {
	
	properties: ["mail", "name", "prename", "password", "birthday"],
	
	cast: {}, 
	
	indexes: ["mail", "name"],
	
	setters: {},
	
	getters: {
		full_name: function() {
			return this.prename + " " + this.name;
		}
	}, 
	
	methods: {
		save: function(fn) {
			this.updated_at = new Date();
			this.__super__(fn);
		}
	}, 
	
	static: {
		
	}
});