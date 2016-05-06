const keystone = require('keystone');

exports = module.exports = (req, res) => {
  const view = new keystone.View(req, res);
  const locals = res.locals;

  // locals.section is used to set the currently selected
  // item in the header navigation.
  // TODO: Make this 'rent' or 'buy' instead of search
  locals.section = 'search';
  locals.filters = {
    category: req.params.category
  };
  locals.data = {};

  // Load all properties
  view.on('init', (next) => {
    keystone.list('Property')
      .model.find()
      .exec((err, results = []) => {
        if (err || !results.length) {
          return next(err);
        }

        locals.data.properties = results;

        return next(err);
      });
  });

  // Render the view
  view.render('search', {
    layout: 'public'
  });
};
