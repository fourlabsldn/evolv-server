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
	firstName: { type: Types.Name, required: true },
	lastName: { type: Types.Email, required: true },
  sellRent: { type: String },
	email: { type: String, required: true },
	telephone: { type: String },
  maxPrice: { type: String },
  minPrice: { type: String },
  otherRequirements: { type: String }
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

Registration.defaultSort = '-createdAt';
Registration.defaultColumns = 'firstName, email, sellRent, createdAt';
Registration.register();
