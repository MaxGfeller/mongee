/**
 * @class Profile Controlller
 * @tag controllers, home
 * @author Christian Scheller
 */
jQuery.Controller.extend('Mongee.Controllers.Profile',
/* @Static */
{

},
/* @Prototype */
{
	init: function () {
		var cookie = jQuery.parseJSON($.cookie('mongee_login'));
		/*Mongee.Models.User.find( cookie._id, cookie.password, function(data) {
			this.element.html(this.view('init', data ));
		});*/
		Mongee.Models.User.find( cookie._id, cookie.password, this.callback('list') );
		
		//this.element.html(this.view('init', { 'id' : cookie._id, 'password' : cookie.password } ));
	},

	list: function ( users ){
		this.element.html(this.view('init', {users:users} ));
		$('li.infos a').attr('class', 'active');
	}
});