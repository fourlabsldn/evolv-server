const keystone = require('keystone');
const ValuationRequest = keystone.list('ValuationRequest');
const ContactForm = require('./helpers/contactForm');

exports = module.exports = (req, res) => {
  const view = new keystone.View(req, res);
  const locals = res.locals;

  const contactForm = new ContactForm({
    databaseModel: ValuationRequest,
    formTitle: 'Get a valuation',
    successMessage: 'Thank you. We will contact you soon.',
    exclude: ['sentAt'],
    formAction: '/valuation'
  });
  locals.data = contactForm.getForm();

  // On POST requests, add the Enquiry item to the database
  view.on('post', { action: 'register' }, next => contactForm.handleSubmission(next, req));

  const viewName = 'valuation';
  locals.section = viewName;

  // Render the view
  const ajaxSources = ['XMLHttpRequest', 'fetch'];
  const requestSource = req.headers['x-requested-with'];
  const pageRequestedViaAjax = ajaxSources.indexOf(requestSource) > -1;

  // Send just form if it was requested via ajax
  const renderOptions = pageRequestedViaAjax ? { layout: null } : {};

  console.log(
    `ajaxSources : ${JSON.stringify(ajaxSources)} ,
    requestSource: "${requestSource}",
    pageRequestedViaAjax: ${pageRequestedViaAjax}
    `);
  view.render(viewName, renderOptions);
};
