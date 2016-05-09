const keystone = require('keystone');

exports = module.exports = (req, res) => {
	const view = new keystone.View(req, res);
	const locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'property';
	locals.data = {};
	locals.filters = {
		slug: req.params.slug
	};

	// Load correct property
  view.on('init', (next) => {
    keystone.list('Property')
      .model.findOne({
				slug: locals.filters.slug
			})
      .exec((err, result) => {
        locals.data.property = result;
        return next(err);
      });
  });

	// Render the view
	view.render('property', { layout: 'public' });
};
