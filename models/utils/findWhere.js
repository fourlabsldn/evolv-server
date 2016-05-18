
/**
 * Executes a query in a database model
 * @method exports
 * @param  {String} criterion - A property name of the model
 * @param  {} value - Antything the model property value should be.
 * @return {Promise} - Will resolve into an array of items.
 */
module.exports = function findWhere(criterion, value) {
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
