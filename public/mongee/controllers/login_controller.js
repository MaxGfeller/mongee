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
		loggedin = false;
		if (!loggedin) {
			$(document.body).html($('<div/>').attr('id','login'));
			//$('login').html();
		}
	}

});