const keystone = require('keystone');
const Types = keystone.Field.Types;
const email = require('../utils/email');
const databaseRecordToHtml = require('../utils/databaseRecordToHtml');

/**
 * Enquiry Model
 * =============
 */

const Enquiry = new keystone.List('Enquiry', {
	nocreate: true,
	noedit: true
});

Enquiry.add({
	name: { type: Types.Text, required: true },
	email: { type: Types.Email, required: true },
	phone: { type: String },
	enquiryType: { type: Types.Select, options: [
		{ value: 'message', label: 'Book a viewing' },
		{ value: 'question', label: 'Ask about a property' },
    { value: 'other', label: 'Talk about a property of yours' },
		{ value: 'other', label: 'Other' }
	] },
	message: { type: Types.Textarea, required: true },
	createdAt: { type: Date, default: Date.now }
});

Enquiry.schema.pre('save', function (next) {
	this.wasNew = this.isNew;
	next();
});

Enquiry.schema.post('save', function () {
	if (this.wasNew) {
		this.sendNotificationEmail();
	}
});

Enquiry.schema.methods.sendNotificationEmail = function (callback) {
  if (typeof callback !== 'function') {
		callback = () => {};
	}

  const emailSubject = 'New Enquiry for Evolv';
  const emailHeading = `<h3>${emailSubject}</h3>`;
  const emailBody = databaseRecordToHtml(Enquiry, this);
  const emailContent = emailHeading + emailBody;

  email.send({
      to: 'sales@evolv.london, lettings@evolv.london',
      subject: emailSubject,
      html: emailContent
  })
  .then(callback);
};

Enquiry.defaultSort = '-createdAt';
Enquiry.defaultColumns = 'name, email, enquiryType, createdAt';
Enquiry.register();
