const keystone = require('keystone');

exports = module.exports = function(req, res) {

	const view = new keystone.View(req, res);
	const locals = res.locals;

  // locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'Home';
	locals.data = {};

	// Load page content from database
  view.on('init', (next) => {
    keystone.list('Home')
      .model.find()
      .exec((err, result) => {
        console.log('Result found:');
        console.dir(result);
        if (Array.isArray(result)) {
          locals.data = result[0];
        }
        return next(err);
      });
  });

  const viewName = 'index';
	// Render the view
  locals.section = viewName;
	view.render(viewName, { layout: 'public' });
};
