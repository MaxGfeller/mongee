/**
 * @class Profile Controlller
 * @tag controllers, profile
 * @author Christian Scheller
 */
jQuery.Controller.extend('Mongee.Controllers.Profile',
/* @Static */
{

},
/* @Prototype */
{
	init: function () {
		this.element.html(this.view('init', { } ));
		this.header();
		this.sidebar();
		this.wall();
		//this.element.html(this.view('init', { 'id' : cookie._id, 'password' : cookie.password } ));
	},
	
	header: function() {
		$('#profile_header').html( this.view('header', { name : 'Vorname Name', status : 'Status' } ));
	},
	
	sidebar: function() {
		var cookie = jQuery.parseJSON($.cookie('mongee_login'));
		Mongee.Models.User.findMyFriends( { 'id' : cookie._id, 'pw' : cookie.password }, this.callback('initSidebar') );
		
	},
	
	initSidebar: function (data) {
		$('#sidebar').html( this.view( 'sidebar' , { data : data }) );
	},

	wall: function () {
		var cookie = jQuery.parseJSON($.cookie('mongee_login'));
		Mongee.Models.Post.findWall( { 'id' : cookie._id, 'pw' : cookie.password, 'wall_id' : '' }, this.callback('showView', 'wall') );
	},

	info: function () {
		var cookie = jQuery.parseJSON($.cookie('mongee_login'));
		Mongee.Models.User.find( { 'id' : cookie._id }, this.callback('showView', 'info') );
	},

	pictures: function () {
		this.showView('pictures' , {});
	},

	friends: function () {
		var cookie = jQuery.parseJSON($.cookie('mongee_login'));
		Mongee.Models.User.findMyFriends( { 'id' : cookie._id, 'pw' : cookie.password }, this.callback('showView', 'friends') );
	},
	
	showView: function ( showView, data ) {
		$('#profile_content').html(this.view( showView, { data : data }));
		$('#profile_menu li a').removeClass();
		$('#profile_menu li.' + showView + ' a').attr('class', 'active');
	},
	
	'#profile_menu a click': function (el, ev) {
		ev.preventDefault();
		this[el.attr('href').substr(1)]();
		//if(typeof fn === 'function') { fn(); }
	}
});