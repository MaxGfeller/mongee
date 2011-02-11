/**
 * @tag controllers, home
 */
jQuery.Controller.extend('Mongee.Controllers.Profile',
/* @Static */
{

},
/* @Prototype */
{
	init: function () {
		this.element.html(this.view('init', {} ));
	}
});