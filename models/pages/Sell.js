/* eslint-disable max-len*/

const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * Sell Model
 * =============
 */

const Sell = new keystone.List('Sell', {
	// nocreate: true,
  // nodelete: true
});

Sell.add(
  'Section 1',
  {
    section_1: {
      main_heading: { type: Types.Text, required: true, default: 'SELLING YOUR PROPERTY', label: 'Main heading' },
      main_subheading: { type: Types.Text, required: true, default: 'Exceptional service, outstanding results', label: 'Main subheading' }
    }
  },
  'Section 2',
  {
    section_2: {
      heading: { type: Types.Text, required: true, default: 'A very personal approach', label: 'Heading' },
      content: { type: Types.Textarea, height: 500, label: 'Content' }
    }
  },
  'Section 3',
  {
    section_3: {
      heading: { type: Types.Text, required: true, default: 'What we do', label: 'Heading' },
      content: { type: Types.Textarea, height: 500, label: 'Content' },
      column_1: {
        heading: { type: Types.Text, required: true, default: 'Selling only', label: 'Column 1 - Heading' },
        content: { type: Types.Textarea, height: 500, label: 'Column 1 - Content' }
      },
      column_2: {
        heading: { type: Types.Text, required: true, default: 'Full Management', label: 'Column 2 - Heading' },
        content: { type: Types.Textarea, height: 500, label: 'Column 2 - Content' }
      }
    }
  },
  'Section 4',
  {
    section_4: {
      heading: { type: Types.Text, required: true, default: 'Looking to sell?', label: 'Heading' },
      content: { type: Types.Textarea, default: 'Register your details and tell us what you are looking for', height: 500, label: 'Content' }
    }
  }
);

Sell.defaultColumns = 'section_1.main_heading, section_1.main_subheading';
Sell.register();
