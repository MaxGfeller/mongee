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
		Mongee.Models.User.login( { 'user': { 'mail': mail, 'password': pw } }, this.callback('loginSuccess'), this.callback('loginError'));
	},
	
	loginSuccess: function (data) {
		$.cookie('mongee_login', '{ "mail": "' + data.mail + '", "password":"' + data.password + '", "_id":"' + data._id + '" }');
		$(document.body).html($('<div/>').attr('id','index'));
		
		//$('#index').mongee_index();
		$(document.body).html(this.view('init', {} ));
		$('#header').mongee_header();
		$('#mainframe').mongee_profile();
	},
	
	loginError: function () {
		if(!$('#login_error').length)
			$(document.body).html(this.view('login', {} ));
		$('#login_error').html(this.view('login_error', {} ));
	},
	
	logout: function () {
		$(document.body).html(this.view('login', {} ));
		$.cookie('mongee_login', null);
	},
	
	loadContent: function (anchor) {
		//anchor = anchor.substr(1);
		temp = anchor.split('/');
		if (temp) {
			
		}
		//$('#mainframe').mongee_profile();
	},

	'#login_form submit': function( el, ev ){
		ev.preventDefault();
		this.login( el.formParams().mail, $.md5(el.formParams().pw) );
	},

	'.logout click': function () {
		this.logout();
	}/*,
	
	'a click': function (el, ev) {
		ev.preventDefault();
		alert(el.attr('href'));
		this.loadContent(el.attr('href'));
	}*/
});