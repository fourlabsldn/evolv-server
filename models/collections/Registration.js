const keystone = require('keystone');
const Types = keystone.Field.Types;
const email = require('../utils/email');
const databaseRecordToHtml = require('../utils/databaseRecordToHtml');

/**
 * Registration Model
 * =============
 */

const Registration = new keystone.List('Registration', {
	nocreate: true,
	noedit: true
});

Registration.add({
  sellRent: { type: Types.Select, label: 'Sell or Rent', required: true, options: [
    { value: 'sell', label: 'Sell' },
    { value: 'rent', label: 'Rent' },
    { value: 'both', label: 'Both' }
  ] },
	firstName: { type: Types.Text, required: true, label: 'First Name' },
	lastName: { type: Types.Text, label: 'Last Name' },
	email: { type: Types.Email, label: 'Email', required: true },
	phone: { type: Types.Text, label: 'Telephone' },
  maxPrice: { type: Types.Money, label: 'Maximum price', currency: 'en-gb' },
  minPrice: { type: Types.Money, label: 'Minimum price', currency: 'en-gb' },
  otherRequirements: { type: Types.Textarea, label: 'Other requirements', height: 200 },
  sentAt: { type: Types.Datetime, label: 'Sent at', default: Date.now }
});

Registration.schema.pre('save', function (next) {
	this.wasNew = this.isNew;
	next();
});

Registration.schema.post('save', function () {
	if (this.wasNew) {
		this.sendNotificationEmail();
	}
});

Registration.schema.methods.sendNotificationEmail = function (callback) {
  if (typeof callback !== 'function') {
		callback = () => {};
	}

  const users = keystone.list('User');
  const emailSubject = 'New Registration for Evolv';
  const emailHeading = `<h3>${emailSubject}</h3>`;
  const emailBody = databaseRecordToHtml(Registration, this);
  const emailContent = emailHeading + emailBody;

  users.getAdminEmails()
  .then((adminEmails) => {
    return email.send({
      to: adminEmails,
      subject: emailSubject,
      html: emailContent
    });
  })
  .then(callback);
};

Registration.defaultSort = '-sentAt';
Registration.defaultColumns = 'sentAt, firstName, email, sellRent';
Registration.register();
