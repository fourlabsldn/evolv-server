const keystone = require('keystone');

exports = module.exports = (req, res) => {
  const view = new keystone.View(req, res);
  const locals = res.locals;
  locals.data = {};
  locals.data.formTitle = 'Register';
  locals.data.formFields = [
    {
      type: 'text'
    },
    {
      type: 'select'
    },
    {
      type: 'select'
    }
  ];

  const viewName = 'register';

  locals.section = viewName;
  // Render the view
  view.render(viewName, {
    layout: 'public'
  });
};
