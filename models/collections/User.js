const keystone = require('keystone');
const Types = keystone.Field.Types;
/**
 * User Model
 * ==========
 */

const User = new keystone.List('User');

User.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, index: true },
	password: { type: Types.Password, initial: true, required: true }
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true }
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function () {
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
  return this.findWhere('isAdmin', true)
    .then((admins) => {
      const adminsEmails = admins.map(admin => admin.email);
      const commaSeparatedAdminEmails = adminsEmails.join(', ');
      return commaSeparatedAdminEmails;
    });
};

/**
 * Registration
 */

User.defaultColumns = 'name, email, isAdmin';
User.register();
