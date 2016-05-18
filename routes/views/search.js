const keystone = require('keystone');

/**
 * [description]
 * @method
 * @param  {Object} req [description]
 * @param  {Object} res [description]
 * @param  {String} pageName - pageName is not only the name of the page buy also
 *                           	the name of a field in the Property collection.
 * @return {[type]} [description]
 */
exports = module.exports = (req, res, pageName) => {
  const view = new keystone.View(req, res);
  const locals = res.locals;

  locals.section = pageName;
  locals.filters = {
    category: req.params.category
  };
  locals.data = {};

  // Load all properties
  view.on('init', (next) => getProperties(next, locals, pageName));

  // Render the view
  const viewName = 'search';
	view.render(viewName, { layout: 'public' });
};

function getProperties(next, locals, pageName) {
  keystone.list('Property').findWhere(`${pageName}.available`, true)
  .then((results) => {
    locals.data.properties = results;
    next();
  })
  .catch(next);
}
