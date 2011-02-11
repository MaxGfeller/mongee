/**
 * @tag models, home
 * Wraps backend user services.  Enables 
 * [Mongee.Models.User.static.findAll retrieving],
 * [Mongee.Models.User.static.update updating],
 * [Mongee.Models.User.static.destroy destroying], and
 * [Mongee.Models.User.static.create creating] users.
 */
$.Model.extend('Mongee.Models.User',
/* @Static */
{
	/**
 	 * Retrieves users data from your backend services.
 	 * @param {Object} params params that might refine your results.
 	 * @param {Function} success a callback function that returns wrapped user objects.
 	 * @param {Function} error a callback function for an error in the ajax request.
 	 */
	findAll: function( params, success, error ){
		$.ajax({
			url: '/user',
			type: 'get',
			dataType: 'json',
			data: params,
			success: this.callback(['wrapMany',success]),
			error: error,
			fixture: "//mongee/fixtures/users.json.get" //calculates the fixture path from the url and type.
		});
	},
	/**
	 * Updates a user's data.
	 * @param {String} id A unique id representing your user.
	 * @param {Object} attrs Data to update your user with.
	 * @param {Function} success a callback function that indicates a successful update.
 	 * @param {Function} error a callback that should be called with an object of errors.
     */
	update: function( id, attrs, success, error ){
		$.ajax({
			url: '/users/'+id,
			type: 'put',
			dataType: 'json',
			data: attrs,
			success: success,
			error: error,
			fixture: "-restUpdate" //uses $.fixture.restUpdate for response.
		});
	},
	/**
 	 * Destroys a user's data.
 	 * @param {String} id A unique id representing your user.
	 * @param {Function} success a callback function that indicates a successful destroy.
 	 * @param {Function} error a callback that should be called with an object of errors.
	 */
	destroy: function( id, success, error ){
		$.ajax({
			url: '/users/'+id,
			type: 'delete',
			dataType: 'json',
			success: success,
			error: error,
			fixture: "-restDestroy" // uses $.fixture.restDestroy for response.
		});
	},
	/**
	 * Creates a user.
	 * @param {Object} attrs A user's attributes.
	 * @param {Function} success a callback function that indicates a successful create.  The data that comes back must have an ID property.
	 * @param {Function} error a callback that should be called with an object of errors.
	 */
	create: function( attrs, success, error ){
		$.ajax({
			url: '/users',
			type: 'post',
			dataType: 'json',
			success: success,
			error: error,
			data: attrs,
			fixture: "-restCreate" //uses $.fixture.restCreate for response.
		});
	},
	/**
	 * Trys to login user.
	 * Returns a JSON object of the user, if the credentials were not ok a 401
	 * @param {Object} attrs A user's attributes.
	 * @param {Function} success a callback function that indicates a successful create.  The data that comes back must have an ID property.
	 * @param {Function} error a callback that should be called with an object of errors.
	 */
	login: function( attrs ){ 
		$.ajax({
			url: '/user/sign_in',
			type: 'post',
			dataType: 'json', 
			success: function(data, state) {
				alert(state + ': ' + data);
			},
			error: function(data, state) {
				alert(state + ': ' + data);
			},   
			complete: function(xhr, statusText) { 
		        alert('Status: ' + xhr.status); 
		    },
			data: attrs,
			//fixture: "-restCreate" //uses $.fixture.restCreate for response.
		});
	}
},
/* @Prototype */
{});