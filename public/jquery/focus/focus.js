/**
 * jQuery plugin: 
 * checks if a element is focused
 * 
 * You're defining a new selector. See Plugins/Authoring. Then you can do:
 *
 * if ($("...").is(":focus")) {   ... } or:
 *
 * $("input:focus").doStuff(); 
 */
jQuery.extend(
		jQuery.expr[':'], {
			focus: function(element) {
				return element == document.activeElement;      
		} 
}); 