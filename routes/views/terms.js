const keystone = require('keystone');

exports = module.exports = (req, res) => {
  const view = new keystone.View(req, res);
  const locals = res.locals;
  locals.data = {};
  locals.title = 'Terms';

  // Load page content from database
  view.on('init', (next) => {
    keystone.list('Terms')
      .model.find()
      .exec((err, result) => {
        if (Array.isArray(result)) {
          locals.data = result[0];
        }
        return next(err);
      });
  });

  const viewName = 'text';
  locals.section = viewName;
  // Render the view
  view.render(viewName);
};
