

module.exports = class ContactForm {
  /**
   * @method constructor
   * @param  {Object}         config - Contact form configuration fields
   * @param  {keystond.list}  config.databaseModel
   * @param  {String}         config.formTitle
   * @param  {String}         config.successMessage
   * @param  {Array<String>}  config.exclude = [] [description]
   * @param  {String}         config.formAction -Which URL to call when sending the form.
   * @return {Object}
   */
  constructor(config) {
    this.databaseModel = config.databaseModel;
    this.fields = config;
    this.fields.formFields = this.generateFields(config.exclude || []);
  }

  getForm() {
    return this.fields;
  }

  /**
   * @function generateFormFields
   * @param {Array<String>} exclude - Field names to be excluded from the form.
   * @return {Array<Object>} - form fields
   */
  generateFields(exclude) {
    const formFields = [];

    for (const fieldName of Object.keys(this.databaseModel.fields)) {
      if (exclude.indexOf(fieldName) >= 0) { continue; }
      const dbField = this.databaseModel.fields[fieldName];

      let tagName;
      switch (dbField.type) {
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
        required: dbField.options.required,
        placeholder: dbField.label,
        tag: tagName,
        type: dbField.type,
        name: dbField.path,
        options: dbField.ops
      };

      formFields.push(formField);
    }
    return formFields;
  }


  /**
   * Adds record to database or sends form again with error messages
   * @method handleSubmission
   * @param  {Function} next - Express callback
   * @param  {[type]} req - Current request
   * @return {void}
   */
  handleSubmission(next, req) {
    const newRegistration = new this.databaseModel.model(); // eslint-disable-line new-cap
    const updater = newRegistration.getUpdateHandler(req);

    const updateConfig = {
      flashErrors: true,
      // Comma separated field names
      fields: this.fields.formFields.map(field => field.name).join(', '),
      errorMessage: 'There was a problem submitting your enquiry:'
    };

    const updateCallback = (updateProblems) => {
      const errors = updateProblems ? updateProblems.errors : undefined;
      this.fields.submissionSuccessful = !errors;

      if (errors) {
        // Add error message to fields
        this.fields.formFields.forEach((field) => {
          if (errors[field.name]) {
            field.errorMessage = errors[field.name].message;
          }
        });

        // Fill fields with submitted content
        this.fields.formFields.forEach((field) => {
          if (field.tag !== 'select') {
            field.content = req.body[field.name];
            return;
          }
          const selectedOptionValue = req.body[field.name];
          for (const option of field.options) {
            if (option.value === selectedOptionValue) {
              option.selected = true;
            }
          }
        });
      }

      next();
    };

    // Try to add record to database.
    updater.process(req.body, updateConfig, updateCallback);
  }
};
