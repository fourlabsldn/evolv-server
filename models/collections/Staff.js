const keystone = require('keystone');
const Types = keystone.Field.Types;
/**
 * Staff Model
 * ==========
 */

const Staff = new keystone.List('Staff', {
  plural: 'Staff', // Never show 'Staffs' in admin UI
  label: 'Staff' // Never show 'Staffs' in admin UI
});

Staff.add({
  name: { type: Types.Name, required: true, initial: true },
  position: { type: Types.Text, required: true, initial: true },
  email: { type: Types.Email },
	bio: { type: Types.Textarea, height: 500 },
  photo: { type: Types.CloudinaryImage },
  index: { type: Types.Number }
});

// Order by index field
Staff.getOrderedByIndex = function orderByIndex() {
  return this.model.find().sort({ index: 1 });
};

Staff.defaultColumns = 'name, position, index';
Staff.register();
