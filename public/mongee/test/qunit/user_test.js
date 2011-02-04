module("Model: Mongee.Models.User")

test("findAll", function(){
	stop(2000);
	Mongee.Models.User.findAll({}, function(users){
		start()
		ok(users)
        ok(users.length)
        ok(users[0].name)
        ok(users[0].description)
	});
	
})

test("create", function(){
	stop(2000);
	new Mongee.Models.User({name: "dry cleaning", description: "take to street corner"}).save(function(user){
		start();
		ok(user);
        ok(user.id);
        equals(user.name,"dry cleaning")
        user.destroy()
	})
})
test("update" , function(){
	stop();
	new Mongee.Models.User({name: "cook dinner", description: "chicken"}).
            save(function(user){
            	equals(user.description,"chicken");
        		user.update({description: "steak"},function(user){
        			start()
        			equals(user.description,"steak");
        			user.destroy();
        		})
            })

});
test("destroy", function(){
	stop(2000);
	new Mongee.Models.User({name: "mow grass", description: "use riding mower"}).
            destroy(function(user){
            	start();
            	ok( true ,"Destroy called" )
            })
})