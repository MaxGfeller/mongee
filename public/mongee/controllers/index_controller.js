/**
 * @tag controllers, home
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
	}
	
});