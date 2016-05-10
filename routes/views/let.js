const keystone = require('keystone');

exports = module.exports = (req, res) => {
  const view = new keystone.View(req, res);
  const locals = res.locals;

  locals.section = 'let';

  // Render the view
  const viewName = 'let';
  view.render(viewName, {
    layout: 'public'
  });
};
