const keystone = require('keystone');
const Enquiry = keystone.list('Enquiry');
const ContactForm = require('./modules/contactForm');

exports = module.exports = (req, res) => {
  const view = new keystone.View(req, res);
  const locals = res.locals;

  const formTitle = 'Contact us';
  const successMessage = 'Thank you. We will contact you soon.';
  const excludeFields = ['createdAt'];
  const contactForm = new ContactForm(Enquiry, formTitle, successMessage, excludeFields);
  locals.data = contactForm.getForm();

  // On POST requests, add the Enquiry item to the database
  view.on('post', { action: 'register' }, next => contactForm.handleSubmission(next, req));

  const viewName = 'contact';
  locals.section = viewName;
  // Render the view
  view.render(viewName, {
    layout: 'public'
  });
};
