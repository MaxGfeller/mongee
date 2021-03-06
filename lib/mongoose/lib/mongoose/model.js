
/**
 * Module dependencies.
 */

var Document = require('./document')
  , DocumentArray = require('./types/documentarray')
  , MongooseError = require('./error')
  , Query = require('./query').Query
  , FindQuery = require('./query').FindQuery
  , EventEmitter = require('./utils').EventEmitter
  , Promise = require('./promise');

/**
 * Model constructor
 *
 * @param {Object} values to set
 * @api public
 */

function Model (doc) {
  Document.call(this, doc);
};

/**
 * Inherits from Document.
 */

Model.prototype.__proto__ = Document.prototype;

/**
 * Connection the model uses. Set by the Connection or if absent set to the
 * default mongoose connection;
 *
 * @api public
 */

Model.prototype.db;

/**
 * Collection the model uses. Set by Mongoose instance
 *
 * @api public
 */

Model.prototype.collection;

/**
 * Model name.
 *
 * @api public
 */

Model.prototype.name;

/**
 * Saves the document.
 *
 * @see Model#registerHooks
 * @param {Function} callback
 * @api public
 */

Model.prototype.save = function (fn) {
  if (this.isNew) {
    // send entire doc
    this.collection.insert(this.toObject(), fn);
  } else {
    // send delta
    var self = this
      , delta;

    delta = this.activePaths.map('modify', function (path) {
      return self.getValue(path);
    }).reduce( function (delta, type) {
      if (type.doAtomics) {
        type._atomics.forEach( function (op) {
          var obj = delta[op[0]] = {};
          obj[type._path] = op[1].toObject
            ? op[1].toObject() // If the value is an array
            : Array.isArray(op[1])
              ? op[1].map( function (mem) { 
                  return mem.toObject
                    ? mem.toObject()
                    : mem.valueOf
                      ? mem.valueOf()
                      : mem; 
                })
              : op[1].valueOf
                ? op[1].valueOf() // Numbers
                : op[1];
        });
      } else {
        delta[type._path] = this.doc[type._path];
      }
      return delta;
    }, {});

    this.collection.findAndModify({ _id: this.doc._id }, [], delta, {}, fn);
  }
};

/**
 * Remove the document
 *
 * @param {Function} callback
 */

Model.prototype.remove = function (fn) {
  if (this.removing || this.removed) return this;

  if (!this.removing) {
    var promise = this.removing = new Promise(fn)
      , self = this;

    this.collection.remove({ _id: this.doc._id }, function (err) {
      if (err) return promise.error(err);
      promise.complete();
      self.emit('remove');
    });
  }

  return this;
};

/**
 * Register hooks override
 *
 * @api private
 */

Model.prototype.registerHooks = function () {
  // make sure to pass along all the errors from subdocuments
  this.pre('save', function (next) {
    // we keep the error semaphore to make sure we don't
    // call `save` unnecessarily (we only need 1 error)
    var subdocs = 0
      , error = false
      , self = this;

    var arrays = this.activePaths
      .map('init', 'modify', function (i) {
        return self.getValue(i);
      })
      .filter(function (val) {
        return (val && val instanceof DocumentArray && val.length);
      });

    if (!arrays.length) return next();

    arrays.forEach(function (array) {
      subdocs += array.length;
      array.forEach(function (value) {
        if (!error)
          value.save(function (err) {
            if (!error) {
              if (err) {
                error = true;
                next(err);
              } else
                --subdocs || next();
            }
          });
      });
    });
  });

  Document.prototype.registerHooks.call(this);
};

/**
 * Access the options defined in the schema
 *
 * @api private
 */

Model.prototype.__defineGetter__('options', function () {
  return this.schema ? this.schema.options : {};
});

/**
 * Give the constructor the ability to emit events.
 */

for (var i in EventEmitter.prototype)
  Model[i] = EventEmitter.prototype[i];

/**
 * Called when the model compiles
 *
 * @api private
 */

Model.init = function () {
  // build indexes
  var self = this
    , indexes = this.schema.indexes
    , count = indexes.length;

  indexes.forEach(function (index) {
    self.collection.ensureIndex(index[0], index[1], function(){
      --count || self.emit('index');
    });
  });
};

/**
 * Document schema 
 *
 * @api public
 */

Model.schema;

/**
 * Database instance the model uses.
 *
 * @api public
 */

Model.db;

/**
 * Collection the model uses.
 *
 * @api public
 */

Model.collection;

/**
 * Define properties that access the prototype.
 */

['db', 'collection', 'schema', 'options'].forEach(function(prop){
  Model.__defineGetter__(prop, function(){
    return this.prototype[prop];
  });
});

/**
 * Register hooks for some methods.
 */

Document.registerHooks.call(Model, 'save', 'remove', 'init');

/**
 * Module exports.
 */

module.exports = exports = Model;

/**
 * Creates a query for the signature `query, options, callback`
 *
 * @param {Object} query
 * @param {Object} options for the query
 * @param {Function} callback
 * @param {Function} function to be called when query executes
 * @api private
 */

Model.query = function (query, options, callback, onExecute) {
  // determine callback for `query, fields, callback, options` signature
  if ('function' == typeof options) {
    callback = options;
    options = {};
  }

  if (!options)
    options = {};

  // merge query defaults from schema options
  if (!('safe' in options))
    options.safe = this.options.safe;

  var query = new Query(query, options, onExecute);

  if (callback) {
    query.addBack(callback);
    query.run();
  }

  return query;
};

/**
 * Creates a query for the signature `query, fields, callback, options`
 *
 * @param {Object} query
 * @param {Object} fields to get, or array of fields
 * @param {Object} options for the query
 * @param {Function} callback
 * @param {Function} function to be called when query executes
 * @api private
 */

Model.findQuery = function (query, fields, options, callback, onExecute) {
  if ('function' == typeof fields) {
    callback = fields;
    fields = {};
    options = {};
  } else if ('function' == typeof options) {
    callback = options;
    options = {};
  }

  var query = new FindQuery(query, fields, options, onExecute);
 
  if (callback) {
    query.addBack(callback);
    query.run();
  }

  return query;
};

/**
 * Casts a query
 *
 * Examples:
 *     
 *     // will return { _id: ObjectId }
 *     castQuery({ _id: '4c40f33a37483d8e14000001' })
 * 
 * @param {Object} query
 * @api private
 */

Model.castQuery = function (query) {
  var ret = {};

  for (var i in query){
    if (query[i] === null || query[i] === undefined)
      ret[i] = query[i]
    // TODO: cast within nested modifiers ($gt, $ne, etc)
    else if (query[i].constructor == Object || query[i].constructor == RegExp
        || Array.isArray(query[i]))
      ret[i] = query[i];
    else
      ret[i] = this.schema.path(i).cast(query[i]);
  }

  return ret;
};

/**
 * Finds documents
 *
 * Examples:
 *    // retrieve only certain keys
 *    MyModel.find({ name: /john/i }, ['name', 'friends'], function () { })
 *
 *    // pass options
 *    MyModel.find({ name: /john/i }, [], { skip: 10 } )
 *
 * @param {Object} query
 * @param {Object/Function} (optional) fields to hydrate or callback
 * @param {Function} callback
 * @api public
 */

Model.find = function (query, fields, options, callback) {
  var self = this;

  return this.findQuery(query, fields, options, callback, function (query) {
    var q = this
      , casted = self.castQuery(this.query);

    if (this.fields)
      this.options.fields = this.fields;

    self.collection.find(casted, this.options, function (err, cursor) {
      if (err) return q.queryComplete(err);

      cursor.toArray(function(err, docs){
        if (err) return q.queryComplete(err);

        var arr = []
          , count = docs.length;

        if (!count) return q.queryComplete(null, []);

        for (var i = 0, l = docs.length; i < l; i++){
          arr[i] = new self();
          arr[i].init(docs[i], function () {
            --count || q.queryComplete(null, arr);
          });
        }
      });
    });
  });
};

/**
 * Finds by id
 *
 * @param {ObjectId/Object} objectid, or a value that can be casted to it
 * @api public
 */

Model.findById = function (id, fields, options, callback) {
  return this.findOne({ _id: id }, fields, options, callback);
};

/**
 * Finds one document
 *
 * @param {Object} query
 * @param {Object/Function} (optional) fields to hydrate or callback
 * @param {Function} callback
 * @api public
 */

Model.findOne = function (query, fields, options, callback) {
  var self = this;

  return this.findQuery(query, fields, options, callback, function () {
    var q = this
      , casted = self.castQuery(this.query);

    if (this.fields)
      this.options.fields = this.fields;

    self.collection.findOne(casted, this.options, function (err, doc) {
      if (err) return q.queryComplete(err);

      if (!doc) return q.queryComplete(null, null);
      
      var casted = new self();

      casted.init(doc, function () {
        q.queryComplete(null, casted);
      });
    });
  });
};

/**
 * Counts documents
 *
 * @param {Object} query
 * @param {Function} optional callback
 * @api public
 */

Model.count = function (query, callback) {
  var self = this;

  return this.query(query, {}, callback, function () {
    var casted = self.castQuery(this.query);
    self.collection.count(casted, this.queryComplete.bind(this));
  });
};

/**
 * Updates documents.
 *
 * Examples:
 *
 *     MyModel.update({ age: { $gt: 18 } }, { oldEnough: true }, fn);
 *     MyModel.update({ name: 'Tobi' }, { ferret: true }, { multi: true }, fn);
 *
 * Valid options:
 *  - safe (boolean) safe mode (defaults to value set in schema (false))
 *  - upsert (boolean) whether to create the doc if it doesn't match (false)
 *  - multi (boolean) whether multiple documents should be update (false)
 *
 * @param {Object} query
 * @param {Object] doc
 * @param {Object/Function} optional options or callback
 * @param {Function} callback
 * @return {Query}
 * @api public
 */

Model.update = function (query, doc, options, callback) {
  var self = this;

  return this.query(query, options, callback, function () {
    var castQuery = self.castQuery(this.query)
      , castDoc = self.castQuery(doc)
      , queryComplete = this.queryComplete.bind(this);

    self.collection.update(castQuery, castDoc, this.options, queryComplete);
  });
};

/**
 * Compiler utility.
 *
 * @param {String} model name
 * @param {Schema} schema object
 * @param {String} collection name
 * @param {Connection} connection to use
 * @param {Mongoose} mongoose instance
 * @api private
 */

Model.compile = function (name, schema, collectionName, connection, base) {
  // generate new class
  function model () {
    Model.apply(this, arguments);
  };

  model.name = name;
  model.__proto__ = Model;
  model.prototype.__proto__ = Model.prototype;
  model.prototype.base = base;
  model.prototype.schema = schema;
  model.prototype.db = connection;
  model.prototype.collection = connection.collection(collectionName);

  // apply methods
  for (var i in schema.methods)
    model.prototype[i] = schema.methods[i];

  // apply statics
  for (var i in schema.statics)
    model[i] = schema.statics[i];

  return model;
};
