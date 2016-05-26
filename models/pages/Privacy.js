/* eslint-disable max-len*/

const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * Sell Model
 * =============
 */

const Privacy = new keystone.List('Privacy', {
	nocreate: true,
  nodelete: true,
  plural: 'Privacy', // Never show 'Privacy' in admin UI
  label: 'Privacy'
});

Privacy.add(
  'Content',
  {
    content: {
			heading: { type: Types.Text, required: true, default: 'Privacy', label: 'Heading' },
      content: { type: Types.Html, wysiwyg: true, height: 500, label: 'Content' }
    }
  }
);

Privacy.defaultColumns = 'content.heading';
Privacy.register();
