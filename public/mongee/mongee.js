/**
 * @page mongee Mongee
 * @tag home
 *
 * ###Mongee
 *  
 * Mongee is a Social Networking Platform
 *  
 */

steal.plugins(	
	'jquery/controller',			// a widget factory
	'jquery/controller/subscribe',	// subscribe to OpenAjax.hub
	'jquery/view/ejs',				// client side templates
	'jquery/controller/view',		// lookup views with the controller's name
	'jquery/model',					// Ajax wrappers
	'jquery/dom/fixture',			// simulated Ajax requests
	'jquery/dom/form_params',		// form data helper
	
	'jquery/cookie',				// jQuery Cookie plugin
	'jquery/md5',					// jQuery MD5 hash algorithm function
	'jquery/base64',				// jQuery BASE64 functions
	'jquery/focus',					// jQuery plugin: checks if a element is focused
	'jquery/autocomplete')			// autocomplete
	
	.css('mongee')					// loads styles

	.resources()					// 3rd party script's (like jQueryUI), in resources folder

	.models('user', 'post')					// loads files in models folder 

	.controllers('main', 'index', 'profile', 'header')			// loads files in controllers folder

	.views();						// adds views to be added to build