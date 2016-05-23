const keystone = require('keystone');
const Registration = keystone.list('Registration');
const ContactForm = require('./helpers/contactForm');
const isAjaxRequest = require('./helpers/isAjaxRequest');

exports = module.exports = (req, res) => {
  const view = new keystone.View(req, res);
  const locals = res.locals;

  const contactForm = new ContactForm({
    databaseModel: Registration,
    formTitle: 'Register',
    successMessage: 'Thank you for registering',
    exclude: ['sentAt']
  });
  locals.data = contactForm.getForm();

  // On POST requests, add the Enquiry item to the database
  view.on('post', { action: 'register' }, next => contactForm.handleSubmission(next, req));

  const viewName = 'register';
  locals.section = viewName;

  locals.isAjaxRequest = isAjaxRequest(req);
  const renderOptions = locals.isAjaxRequest ? { layout: null } : {};

  // Render the view
  view.render('form', renderOptions);
};
