
/**
 * Module dependencies.
 */

var Promise = require('./promise');

/**
 * Query constructor
 *
 * @api private
 */

function Query (query, options, onExecute) {
  Promise.call(this);
  this.query = query || {};
  this.options = options || {};
  this.onExecute = onExecute;
  this.executed = false;
};

/**
 * Inherits from Promise.
 */

Query.prototype.__proto__ = Promise.prototype;

/**
 * Runs the Query
 *
 * @api private
 */

Query.prototype.run = function () {
  this.executed = true;
  
  if (this.onExecute) {
    try {
      this.onExecute.call(this);
    } catch (e) {
      this.queryComplete(e);
    }
  }

  return this;
};

/**
 * Sets an option
 *
 * @param {String} key
 * @param {Object} optional value
 * @api public
 */

Query.prototype.set = function (key, value) {
  if (arguments.length == 1)
    return this.options[key];
  this.options[key] = value;
  return this;
};

/**
 * Add conditions to query
 *
 * @param {Object} query
 * @api public
 */

Query.prototype.where = function (obj, value) {
  if (value == undefined)
    for (var i in obj)
      this.query[i] = obj[i];
  else
    this.query[obj] = value;
  return this;
};

/**
 * Resolves the promise from a driver response
 *
 * @api private
 */

Query.prototype.queryComplete = function (err) {
  if (err)
    this.error(err);
  else
    this.complete.apply(this, Array.prototype.slice.call(arguments, 1));

  return this;
};

/**
 * Find Query constructor (for queries that retrieve docs)
 *
 * @api private
 */

function FindQuery (query, fields, options, onExecute) {
  this.fields = fields || {};
  Query.call(this, query, options, onExecute);
};

/**
 * Inherits from Query.
 */

FindQuery.prototype.__proto__ = Query.prototype;

/**
 * Specifies fields to return
 *
 * Examples:
 *
 *    // these three are equivalent
 *    query.select('field', 'field2')
 *    query.select({ field: 1, field2: 1 })
 *    query.select(('field', 'field2');
 *
 * @api public
 */

FindQuery.prototype.select = function () {
  for (var i = 0, l = arguments.length; i < l; i++) {
    if (Array.isArray(arguments[i])) {
      for (var a = 0, l = arguments[i].length; a < l; a++)
        this.fields[arguments[i][a]] = 1;
    } else if ('object' == typeof arguments[i]) {
      for (var a in arguments[i])
        this.fields[a] = arguments[i][a];
    } else if ('string' == typeof arguments[i]) {
      this.fields[arguments[i]] = 1;
    }
  }
  return this;
};

/**
 * Module exports
 */

exports.Query = Query;

exports.FindQuery = FindQuery;
