const keystone = require('keystone');
const Registration = keystone.list('Registration');
const excludeFields = ['sentAt'];
exports = module.exports = (req, res) => {
  const view = new keystone.View(req, res);
  const locals = res.locals;
  locals.data = {
    formTitle: 'Register',
    formFields: generateFormFields(Registration, excludeFields)
  };

  // On POST requests, add the Enquiry item to the database
  view.on('post', { action: 'register' }, next => handlePost(next, locals, req));

  const viewName = 'register';
  locals.section = viewName;
  // Render the view
  view.render(viewName, {
    layout: 'public'
  });
};

/**
 * @function generateFormFields
 * @param  {Object} databaseModel - An object from keystone.list('CollectionName')
 * @param {Array<String>} exclude - Field names to be excluded from the form.
 * @return {Array<Object>}
 */
function generateFormFields(databaseModel, exclude) {
  const formFields = [];

  for (const fieldName of Object.keys(databaseModel.fields)) {
    if (exclude.indexOf(fieldName) >= 0) { continue; }
    const databaseField = Registration.fields[fieldName];

    let tagName;
    switch (databaseField.type) {
      case 'textarea':
        tagName = 'textarea';
        break;
      case 'select':
        tagName = 'select';
        break;
      default:
        tagName = 'input';
    }

    const formField = {
      required: databaseField.options.required,
      placeholder: databaseField.label,
      tag: tagName,
      type: databaseField.type,
      name: databaseField.path,
      options: databaseField.ops
    };

    formFields.push(formField);
  }
  return formFields;
}

function handlePost(next, locals, req) {
  const newRegistration = new Registration.model(); // eslint-disable-line new-cap
  const updater = newRegistration.getUpdateHandler(req);

  const updateConfig = {
    flashErrors: true,
    // Comma separated field names
    fields: locals.data.formFields.map(field => field.name).join(', '),
    errorMessage: 'There was a problem submitting your enquiry:'
  };

  const updateCallback = (updateProblems) => {
    if (!updateProblems) {
      locals.registrationSuccessful = true;
    } else {
      const errors = updateProblems.errors;

      // Add error message to fields
      locals.data.formFields.forEach((field) => {
        if (errors[field.name]) {
          field.errorMessage = errors[field.name].message;
        }
      });

      console.log(`Validation errors: ${JSON.stringify(errors)}`);
      locals.registrationSuccessful = false;
    }
    next();
  };

  // Try to add record to database.
  updater.process(req.body, updateConfig, updateCallback);
}
