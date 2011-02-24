var fs = require("fs");

var mappingString = "";

function bootController(app, file) {
  var name = file.replace('.js', '');
  var actions = require('../controllers/' + name);
  var plural = name + 's';
  var prefix = '/' + plural;

	var mapping = actions["mapping"];
	
  Object.keys(actions).map(function(action){
	  var fn = actions[action];
	  
	  if(typeof(fn) === "function") {
		  if(a = mapping[action]) {
		  	switch(a.method) {
		  		case 'get':
		  					app.get(a.url, fn);
		  					console.log("get " + a.url);
		  					mappingString += "GET " + a.url + "<br />";
		  					break;
		  		case 'post':
		  					app.post(a.url, fn);
		  					console.log("post " + a.url);
		  					mappingString += "POST " + a.url + "<br />";
		  					break;
		  		case 'put':
		  					app.put(a.url, fn);
		  					console.log("put " + a.url);
		  					mappingString += "PUT " + a.url + "<br />";
		  					break;
		  		case 'delete':
		  					app.del(a.url, fn);
		  					console.log("delete " + a.url);
		  					mappingString += "DELETE " + a.url + "<br />";
		  					break;
		  	}
		  } else {
		  	console.log("WARNING: no mapping for " + action + " defined");
		  }
	}
 });
}

module.exports = {
	bootControllers : function(app) {
    fs.readdir(__dirname + '/../controllers', function(err, files){
        if (err) throw err;
        files.forEach(function(file){
            console.log("booting controller " + file);
            bootController(app, file);
        });
        app.get("/show_available_interfaces", function(req, res){
        	res.send(mappingString);
        });
    });
	}
}