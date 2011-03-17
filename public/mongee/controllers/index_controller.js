/**
 * @class Index Controlller
 * @tag controllers, home
 * @author Christian Scheller
 */
jQuery.Controller.extend('Mongee.Controllers.Index',
/* @Static */
{

},
/* @Prototype */
{
	init: function () {
		$(document.body).html(this.view('init', {} ));
		$('#header').mongee_header();
		$('#mainframe').mongee_profile();
	},
	
	'#searchform submit': function( el, ev ){
		ev.preventDefault();
	}

});