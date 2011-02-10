/**
 * @tag controllers, home
 */
jQuery.Controller.extend('Mongee.Controllers.Login',
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
		if ($.cookie('mongee_login') == undefined) {
			$(document.body).html($('<div/>').attr('id','login'));
			$('#login').html(this.view('login', {} ));
		} else {
			this.login( jQuery.parseJSON($.cookie('mongee_login')).mail, jQuery.parseJSON($.cookie('mongee_login')).password );			
		}
	},
	
	 /**
	 * Responds to the login form being submitted by signing in.
	 * @param {jQuery} el A jQuery wrapped element.
	 * @param {Event} ev A jQuery event whose default action is prevented.
	 */
	'#login_form submit': function( el, ev ){
		ev.preventDefault();
		this.login( el.formParams().user, $.md5(el.formParams().pw) );
	},
	
	login: function ( mail, pw ){
		Mongee.Models.User.login( { 'user': { 'mail': mail, 'password': pw } }, function(data) {
			data = jQuery.parseJSON(data);
			$.cookie('mongee_login', '{ "mail": "' + data.mail + '", "password":"' + data.password + '", "_id":"' + data._id + '" }');
			Mongee.Controllers.Index.init();
		});
	},
	
	logout: function ( ){
		alert('asdf');
		$.cookie('mongee_login', null);
		$(document.body).html($('<div/>').attr('id','login'));
		$('#login').html(this.view('login', {} ));
	}
});