var Func = function(){};

Func.prototype = {
	stringify : function(o) {
		return JSON.stringify(o);
	}
};

module.exports = Func;