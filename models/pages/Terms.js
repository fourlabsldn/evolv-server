/* eslint-disable max-len*/

const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * Sell Model
 * =============
 */

const Terms = new keystone.List('Terms', {
	nocreate: true,
  nodelete: true,
  plural: 'Terms', // Never show 'Terms' in admin UI
  label: 'Terms'
});

Terms.add(
  'Content',
  {
    content: {
			heading: { type: Types.Text, required: true, default: 'Terms & conditions', label: 'Heading' },
      content: { type: Types.Html, wysiwyg: true, height: 500, label: 'Content' }
    }
  }
);

Terms.defaultColumns = 'content.heading';
Terms.register();
