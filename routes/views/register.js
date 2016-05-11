const registerFormFields = [
  {
    required: true,
    tag: 'select',
    type: 'select',
    name: 'sellRent',
    options: [
      { text: 'Sell or Rent', disabled: true, selected: true },
      { text: 'Sell' },
      { text: 'Rent' }
    ]
  },
  {
    required: true,
    tag: 'input',
    type: 'text',
    placeholder: 'First Name',
    name: 'firstName'
  },
  {
    tag: 'input',
    type: 'text',
    placeholder: 'Last Name',
    name: 'lastName'
  },
  {
    required: true,
    tag: 'input',
    type: 'email',
    placeholder: 'Email',
    name: 'email'
  },
  {
    tag: 'input',
    type: 'text',
    placeholder: 'Telephone',
    name: 'telephone'
  },
  {
    tag: 'input',
    type: 'text',
    placeholder: 'Maximum price',
    name: 'maxPrice'
  },
  {
    tag: 'input',
    type: 'text',
    placeholder: 'Minimum price',
    name: 'minPrice'
  },

  {
    tag: 'textarea',
    type: 'textarea',
    placeholder: 'Any other requirements',
    name: 'otherRequirements'
  }
];

const keystone = require('keystone');
const Registration = keystone.list('Registration');

exports = module.exports = (req, res) => {
  const view = new keystone.View(req, res);
  const locals = res.locals;
  locals.data = {};
  locals.data.formTitle = 'Register';
  locals.data.formFields = registerFormFields;

  // On POST requests, add the Enquiry item to the database
  view.on('post', { action: 'register' }, (next) => {
    console.log(`Post received. Content: \n${JSON.stringify(req.body)}`);

    const newRegistration = new Registration.model(); // eslint-disable-line new-cap
		const updater = newRegistration.getUpdateHandler(req);

    const updateConfig = {
      flashErrors: true,
      // Comma separated field names
      fields: registerFormFields.map(field => field.name).join(', '),
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
  });

  const viewName = 'register';

  locals.section = viewName;
  // Render the view
  view.render(viewName, {
    layout: 'public'
  });
};
