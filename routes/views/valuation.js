const keystone = require('keystone');
const ValuationRequest = keystone.list('ValuationRequest');
const ContactForm = require('./helpers/contactForm');
const isAjaxRequest = require('./helpers/isAjaxRequest');

exports = module.exports = (req, res) => {
  const view = new keystone.View(req, res);
  const locals = res.locals;
  locals.isAjaxRequest = isAjaxRequest(req);
  locals.title = (locals.isAjaxRequest && req.query.title)
    ? req.query.title
    : 'Get a Valuation';

  const contactForm = new ContactForm({
    databaseModel: ValuationRequest,
    formTitle: locals.title,
    successMessage: 'Thank you. We will contact you soon.',
    exclude: ['sentAt'],
    formAction: '/valuation'
  });
  locals.data = contactForm.getForm();

  // On POST requests, add the Enquiry item to the database
  view.on('post', { action: 'register' }, next => contactForm.handleSubmission(next, req));

  const viewName = 'valuation';
  locals.section = viewName;

  const renderOptions = locals.isAjaxRequest ? { layout: null } : {};

  view.render('form', renderOptions);
};
