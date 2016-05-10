const keystone = require('keystone');

exports = module.exports = (req, res) => {
  const view = new keystone.View(req, res);
  const locals = res.locals;

  const viewName = 'sell';

  locals.section = viewName;
  // Render the view
  view.render(viewName, {
    layout: 'public'
  });
};
