// -------------------------------------------------------------------
//
//        This file is used to extend model functionalities
//
// -------------------------------------------------------------------

const keystone = require('keystone');

/**
 * Executes a query in a database model
 * @method findWhere
 * @param  {String} criterion - A property name of the model
 * @param  {} value - Antything the model property value should be.
 * @return {Promise} - Will resolve into an array of items.
 */
keystone.List.prototype.findWhere = function findWhere(criterion, value) {
  return new Promise((resolve, reject) => {
    const model = this.model;
    const query = model.find().where(criterion, value);

    query.exec((err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};


/**
 * Returns a promise to be resolved with all database records
 * @method getAll
 * @return {Promise} - Will resolve into an array of items.
 */
keystone.List.prototype.getAll = function getAll() {
  return new Promise((resolve, reject) => {
    const model = this.model;
    const query = model.find();

    query.exec((err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};
