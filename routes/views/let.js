const keystone = require('keystone');

exports = module.exports = (req, res) => {
  const view = new keystone.View(req, res);
  const locals = res.locals;

	locals.data = {};

	// Load page content from database
  view.on('init', (next) => {
    keystone.list('Let')
      .model.find()
      .exec((err, result) => {
        if (Array.isArray(result)) {
          locals.data = result[0];
        }
        return next(err);
      });
  });

  // Render the view
  const viewName = 'let';
  view.render(viewName, {
    layout: 'public'
  });
};
