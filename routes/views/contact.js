const keystone = require('keystone');
const Enquiry = keystone.list('Enquiry');
const ContactForm = require('./helpers/contactForm');
const isAjaxRequest = require('./helpers/isAjaxRequest');

exports = module.exports = (req, res) => {
  const view = new keystone.View(req, res);
  const locals = res.locals;
  locals.isAjaxRequest = isAjaxRequest(req);

  locals.title = (locals.isAjaxRequest && req.query.title)
    ? req.query.title
    : 'Contact us';

  const contactForm = new ContactForm({
    databaseModel: Enquiry,
    formTitle: locals.title,
    successMessage: 'Thank you. We will contact you soon.',
    exclude: ['createdAt']
  });
  locals.data = contactForm.getForm();

  // On POST requests, add the Enquiry item to the database
  view.on('post', { action: 'register' }, next => contactForm.handleSubmission(next, req));

  const viewName = 'contact';
  locals.section = viewName;

  const renderOptions = locals.isAjaxRequest ? { layout: null } : {};

  // Render the view
  view.render('form', renderOptions);
};
