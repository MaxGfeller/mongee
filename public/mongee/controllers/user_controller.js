/**
 * @tag controllers, home
 * Displays a table of users.	 Lets the user 
 * ["Mongee.Controllers.User.prototype.form submit" create], 
 * ["Mongee.Controllers.User.prototype.&#46;edit click" edit],
 * or ["Mongee.Controllers.User.prototype.&#46;destroy click" destroy] users.
 */
$.Controller.extend('Mongee.Controllers.User',
/* @Static */
{
	onDocument: true
},
/* @Prototype */
{
	 /**
	 * When the page loads, show login screen
	 */
	 load: function(){
		/*if(!$("#user").length){
		 $(document.body).append($('<div/>').attr('id','user'));
			 Mongee.Models.User.findAll({}, this.callback('list'));
	 	}*/
	
		loggedin = false;
		if (!loggedin) {
			$(document.body).html($('<div/>').attr('id','login'));
			$('#login').html(this.view('login', {} ));
			//this.callback('login');
			//$('login').html();
		}
	//}
	},

	login: function(){
		alert('fuuuuu');
		$('#login').html(this.view('login', {} ));
	},

	/**
	* Displays a list of users and the submit form.
	* @param {Array} users An array of Mongee.Models.User objects.
	*/
	list: function( users ){
		$('#user').html(this.view('init', {users:users} ));
	},


 /**
 * Responds to the create form being submitted by creating a new Mongee.Models.User.
 * @param {jQuery} el A jQuery wrapped element.
 * @param {Event} ev A jQuery event whose default action is prevented.
 */
'form submit': function( el, ev ){
	ev.preventDefault();
	new Mongee.Models.User(el.formParams()).save();
},
/**
 * Listens for users being created.	 When a user is created, displays the new user.
 * @param {String} called The open ajax event that was called.
 * @param {Event} user The new user.
 */
'user.created subscribe': function( called, user ){
	$("#user tbody").append( this.view("list", {users:[user]}) );
	$("#user form input[type!=submit]").val(""); //clear old vals
},
 /**
 * Creates and places the edit interface.
 * @param {jQuery} el The user's edit link element.
 */
'.edit click': function( el ){
	var user = el.closest('.user').model();
	user.elements().html(this.view('edit', user));
},
 /**
 * Removes the edit interface.
 * @param {jQuery} el The user's cancel link element.
 */
'.cancel click': function( el ){
	this.show(el.closest('.user').model());
},
 /**
 * Updates the user from the edit values.
 */
'.update click': function( el ){
	var $user = el.closest('.user'); 
	$user.model().update($user.formParams());
},
 /**
 * Listens for updated users.	 When a user is updated, 
 * update's its display.
 */
'user.updated subscribe': function( called, user ){
	this.show(user);
},
 /**
 * Shows a user's information.
 */
show: function( user ){
	user.elements().html(this.view('show',user));
},
 /**
 *	 Handle's clicking on a user's destroy link.
 */
'.destroy click': function( el ){
	if(confirm("Are you sure you want to destroy?")){
		el.closest('.user').model().destroy();
	}
 },
 /**
 *	 Listens for users being destroyed and removes them from being displayed.
 */
"user.destroyed subscribe": function(called, user){
	user.elements().remove();	 //removes ALL elements
 }
});