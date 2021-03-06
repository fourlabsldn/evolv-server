const keystone = require('keystone');

/**
 * [description]
 * @method
 * @param  {Object} req [description]
 * @param  {Object} res [description]
 * @param  {String} acquisitionMode - 'rent' or 'buy'
 * @return {void}
 */
exports = module.exports = (req, res, acquisitionMode) => {
	const view = new keystone.View(req, res);
	const locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'property';
  locals.acquisitionMode = acquisitionMode;
	locals.data = {};
	locals.filters = {
		slug: req.params.slug
	};

	// Load correct property
  view.on('init', (next) => {
    const propertyModel = keystone.list('Property').model;
    const propertyQuery = propertyModel.findOne({
			slug: locals.filters.slug
    });

    propertyQuery.exec((err, result) => {
        if (result) {
          locals.data.property = result;
          locals.title = result.location.street1;
          next(err);
        } else {
          res.render('404');
        }
      });
  });

	// Render the view
	const viewName = 'property';
	view.render(viewName);
};
