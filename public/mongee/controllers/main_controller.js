/**
 * @class Main Controlller
 * @tag controllers, home
 * @author Christian Scheller
 */
jQuery.Controller.extend('Mongee.Controllers.Main',
/* @Static */
{
	onDocument: true
},
/* @Prototype */
{
	/**
 	 * When page is (re)loaded, this method will check if the user is logged in
 	 */
	load: function(){
		if ($.cookie('mongee_login') == undefined) {
			$(document.body).html(this.view('login', {} ));
		} else {
			this.login( jQuery.parseJSON($.cookie('mongee_login')).mail, jQuery.parseJSON($.cookie('mongee_login')).password );			
		}
	},
	
	/**
 	 * login user
 	 * @param {String} mail the mail-address
 	 * @param {String} pw the password
 	 */
	login: function ( mail, pw ){
		Mongee.Models.User.login( { 'user': { 'mail': mail, 'password': pw } }, function(data) {
			data = jQuery.parseJSON(data);
			$.cookie('mongee_login', '{ "mail": "' + data.mail + '", "password":"' + data.password + '", "_id":"' + data._id + '" }');
			$(document.body).html($('<div/>').attr('id','index'));
			$('#index').mongee_index();
		}, this.callback('error'));
	},
	
	error: function () {
		if(!$('#login_error').length)
			$(document.body).html(this.view('login', {} ));
		$('#login_error').html(this.view('login_error', {} ));
	},
	
	logout: function ( ){
		$(document.body).html(this.view('login', {} ));
		$.cookie('mongee_login', null);
	},

	'#login_form submit': function( el, ev ){
		ev.preventDefault();
		this.login( el.formParams().mail, $.md5(el.formParams().pw) );
	},

	'#logout click': function () {
		this.logout();
	}
});