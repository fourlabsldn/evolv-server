const keystone = require('keystone');

exports = module.exports = (req, res) => {
  const view = new keystone.View(req, res);
  const locals = res.locals;
  locals.data = {};
  locals.data.formTitle = 'Register';
  locals.data.formFields = [
    {
      type: 'select',
      name: 'sellRent',
      required: true,
      options: [
        { text: 'Sell or Rent', disabled: true, selected: true },
        { text: 'Sell' },
        { text: 'Rent' }
      ]
    },
    {
      type: 'text',
      required: true,
      placeholder: 'First Name',
      name: 'firstName'
    },
    {
      type: 'text',
      placeholder: 'Last Name',
      name: 'lastName'
    },
    {
      type: 'email',
      placeholder: 'Email',
      name: 'email'
    },
    {
      type: 'text',
      placeholder: 'Telephone',
      name: 'telephone'
    },
    {
      type: 'text',
      placeholder: 'Maximum price',
      name: 'maxPrice'
    },
    {
      type: 'text',
      placeholder: 'Minimum price',
      name: 'minPrice'
    },

    {
      type: 'textarea',
      placeholder: 'Any other requirements',
      name: 'otherRequirements',
    }
  ];

  addTagPropertyToFields(locals.data.formFields);
  const viewName = 'register';

  locals.section = viewName;
  // Render the view
  view.render(viewName, {
    layout: 'public'
  });
};


function addTagPropertyToFields(formFields) {
  formFields.forEach((field) => {
    if (field.tag) { return; }
    if (field.type === 'select' ||
        field.type === 'textarea') {
      field.tag = field.type;
    } else {
      field.tag = 'input';
    }
  });
}
