

module.exports = class ContactForm {
  /**
   * @method constructor
   * @param  {keystond.list} databaseModel [description]
   * @param  {String} formTitle [description]
   * @param  {String} successMessage [description]
   * @param  {Array<String>} exclude = [] [description]
   * @param  {String} method = 'POST' [description]
   * @return {Object}
   */
  constructor(databaseModel, formTitle, successMessage, exclude = [], method = 'POST') {
    this.databaseModel = databaseModel;

    this.fields = {
      formFields: this.generateFields(exclude),
      formTitle,
      successMessage,
      method
    };
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
      }

      next();
    };

    // Try to add record to database.
    updater.process(req.body, updateConfig, updateCallback);
  }
};
