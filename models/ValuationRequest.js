const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * ValuationRequest Model
 * =============
 */

const ValuationRequest = new keystone.List('ValuationRequest', {
	nocreate: true,
	noedit: true
});

ValuationRequest.add({
  propertyAddress: { type: Types.Text, required: true, label: 'Property address' },
	name: { type: Types.Text, required: true, label: 'First Name' },
	email: { type: Types.Email, label: 'Email', required: true },
	phone: { type: Types.Text, label: 'Telephone' },
  additionalInfo: { type: Types.Textarea, label: 'Additional Information', height: 200 },
  sentAt: { type: Types.Datetime, label: 'Sent at', default: Date.now }
});

ValuationRequest.schema.pre('save', function (next) {
	this.wasNew = this.isNew;
	next();
});

ValuationRequest.schema.post('save', function () {
	if (this.wasNew) {
		this.sendNotificationEmail();
	}
});

ValuationRequest.schema.methods.sendNotificationEmail = function (callback) {
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
			new keystone.Email('evaluation-request-notification').send({
					to: admins,
					from: {
						name: 'Evolv',
						email: 'contact@evolv.com'
					},
					subject: 'New Valuation Request for Evolv',
					registration
				}, callback);
		});
};

ValuationRequest.defaultSort = '-sentAt';
ValuationRequest.defaultColumns = 'sentAt, name, email, phone';
ValuationRequest.register();
