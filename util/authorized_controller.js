var mongoose		= require("mongoose");

var User = mongoose.model("User");

function get_credentials_from_request(header_value) {
	var value;
  if (value = header_value.match("^Basic\\s([A-Za-z0-9+/=]+)$")) {
  	var auth = (new Buffer(value[1] || "", "base64")).toString("ascii");
  	return {
    	id : auth.slice(0, auth.indexOf(':')),
    	password : auth.slice(auth.indexOf(':') + 1, auth.length)
  	};
  } else {
  	return null;
  }
}

module.exports = {
	handle_authorized_request: function(req, res, fn) {
		var user_id = null;
		var user_password = null;
		
		var auth = get_credentials_from_request(req.headers['authorization']);
		if(auth) {
			user_id = auth.id;
			user_password = auth.password;
			
			User.findOne({_id : user_id, password : user_password}, function(error, user){
				if(user) {
					console.log("user " + user.get("mail") + " successfully authenticated");
					fn(req, res, user);
				} else {
					console.log("failed authorization");
					res.send("somethings wrong with your credentials..." + user_id + " " + user_password, 403);
				}
			});
		} else {
			res.send("not authorized, please login first", 403);
		}
	}
}