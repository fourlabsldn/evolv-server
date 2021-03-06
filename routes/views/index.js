const keystone = require('keystone');

exports = module.exports = function (req, res) {
	const view = new keystone.View(req, res);
	const locals = res.locals;

  // locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'Home';
	locals.data = {};

	// Load page content from database
  view.on('init', next => loadHomeContent(next, locals));

  const viewName = 'index';
	// Render the view
  locals.section = viewName;
	view.render(viewName);
};

function loadHomeContent(next, locals) {
  const queries = [
    keystone.list('Home').getAll(),
    keystone.list('Property').getFeatured(),
    keystone.list('Staff').getOrderedByIndex()
  ];

  // Add loaded content to 'locals' to make it accessible to the view
  Promise.all(queries)
  .then(([homeContent, featuredProperties, staff]) => {
    if (Array.isArray(homeContent)) {
      locals.data = homeContent[0];
    }

    if (Array.isArray(featuredProperties)) {
      locals.featuredProperties = featuredProperties;
    }

    if (Array.isArray(staff)) {
      locals.staff = staff;
    }

    return next();
  })
  .catch(next);
}
