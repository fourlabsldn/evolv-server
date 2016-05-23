const keystone = require('keystone');

/**
 * [description]
 * @method
 * @param  {Object} req [description]
 * @param  {Object} res [description]
 * @param  {String} acquisitionMode - acquisitionMode is not only the name of the page
 *                                  	buy also the name of a field in the Property collection.
 * @return {[type]} [description]
 */
exports = module.exports = (req, res, acquisitionMode = '') => {
  const view = new keystone.View(req, res);
  const locals = res.locals;
  locals.title = acquisitionMode;

  locals.acquisitionMode = acquisitionMode;
  locals.filters = {
    category: req.params.category
  };
  locals.data = {};

  // Load all properties
  view.on('init', (next) => getProperties(next, locals, acquisitionMode));

  // Render the view
  const viewName = 'search';
	view.render(viewName);
};

function getProperties(next, locals, acquisitionMode) {
  keystone.list('Property').findWhere(`${acquisitionMode}.available`, true)
  .then((results) => {
    locals.data.properties = results;
    next();
  })
  .catch(next);
}
