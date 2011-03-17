/**
 * @class Header Controlller
 * @tag controllers, home
 * @author Christian Scheller
 */
jQuery.Controller.extend('Mongee.Controllers.Header',
/* @Static */
{
	
},
/* @Prototype */
{
	init: function () {
		this.element.html(this.view('init', {} ));
	},

	'#searchfield keyup': function () {
		var cookie = jQuery.parseJSON($.cookie('mongee_login'));
		Mongee.Models.User.findAll({'param': $('#searchfield').val(), id: cookie._id, pw: cookie.password}, this.callback('displayResults'));
	},
	
	'#searchfield focusout': function () {
		$('#searchresults').remove();
	},
	
	'displayResults': function (users) {		
		if(!$('#searchresults').length)
			$('#searchform').after($('<div/>').attr('id','searchresults'));

		offset = $('#searchfield').offset();
		$('#searchresults').css({ top: offset.top + 22, left: offset.left } );
		
		if (users != null && users != '') {		
			$('#searchresults').html(this.view('searchresults', {users:'[' + users + ']'}));
		} else {
			$('#searchresults').html('<ul><li>No Results</li></ul>');
		}
	}
});