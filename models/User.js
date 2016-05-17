var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */

var User = new keystone.List('User');

User.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, index: true },
	password: { type: Types.Password, initial: true, required: true }
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true }
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function() {
	return this.isAdmin;
});

/**
 * Relationships
 */

User.relationship({ ref: 'Post', path: 'posts', refPath: 'author' });

/**
 * Collection functions
 */

User.getAdminEmails = function () {
  return new Promise((resolve, reject) => {
    const userModel = User.model;
    const findAdminQuery = userModel.find().where('isAdmin', true);
    findAdminQuery.exec((err, admins) => {
      if (err) {
        reject(err);
        return;
      }

      const adminEmails = admins.map(admin => admin.email).join(', ');
      resolve(adminEmails);
    });
  });
};

/**
 * Registration
 */

User.defaultColumns = 'name, email, isAdmin';
User.register();
