const keystone = require('keystone');
const Types = keystone.Field.Types;

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

	const registration = this;

	keystone
		.list('User')
		.model
		.find()
		.where('isAdmin', true)
		.exec((err, admins) => {
			if (err) {
        callback(err);
        return;
      }
			new keystone.Email('registration-notification').send({
					to: admins,
					from: {
						name: 'Evolv',
						email: 'contact@evolv.com'
					},
					subject: 'New Registration for Evolv',
					registration
				}, callback);
		});
};

Registration.defaultSort = '-sentAt';
Registration.defaultColumns = 'sentAt, firstName, email, sellRent';
Registration.register();
