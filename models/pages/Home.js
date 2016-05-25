const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * Home Model
 * =============
 */

const Home = new keystone.List('Home', {
	nocreate: true,
  nodelete: true,
  plural: 'Home', // Never show 'Home' in admin UI
  label: 'Home' // Never show 'Home' in admin UI
});

Home.add(
  'Section 1',
  {
    section_1: {
      main_heading: { type: Types.Text, required: true, default: 'CONSTANTLY EVOLV(ING)', label: 'Main heading' },
      main_subheading: { type: Types.Text, required: true, default: 'Luxury London Living', label: 'Main subheading' },
    }
  },
  'Section 2',
  {
    section_2: {
      heading: { type: Types.Text, required: true, default: 'A little history of Evolv.', label: 'Heading' },
      content: { type: Types.Textarea, height: 500, label: 'Content' },
      tab_1: {
        title: { type: Types.Text, required: true, default: 'Item 1', label: 'Tab 1 - Heading' },
				icon: { type: Types.Text, required: true, default: 'street-view', label: 'Tab 1 - Icon' },
        content: { type: Types.Textarea, height: 400, label: 'Tab 1 - Content' }
      },
      tab_2: {
        title: { type: Types.Text, required: true, default: 'Item 2', label: 'Tab 2 - Heading' },
				icon: { type: Types.Text, required: true, default: 'university', label: 'Tab 2 - Icon' },
        content: { type: Types.Textarea, height: 400, label: 'Tab 2 - Content' }
      },
      tab_3: {
        title: { type: Types.Text, required: true, default: 'Item 3', label: 'Tab 3 - Heading' },
				icon: { type: Types.Text, required: true, default: 'asterisk', label: 'Tab 3 - Icon' },
        content: { type: Types.Textarea, height: 400, label: 'Tab 3 - Content' }
      },
      tab_4: {
        title: { type: Types.Text, required: true, default: 'Item 4', label: 'Tab 4 - Heading' },
        icon: { type: Types.Text, required: true, default: 'asterisk', label: 'Tab 4 - Icon' },
        content: { type: Types.Textarea, height: 400, label: 'Tab 4 - Content' }
      }
    }
  },
  'Section 3',
  {
    section_3: {
      heading: { type: Types.Text, required: true, default: 'Recent listings', label: 'Heading' },
      content: { type: Types.Textarea, height: 500, label: 'Content' }
    }
  }
);

Home.defaultColumns = 'section_1.main_heading|40%, section_1.main_subheading|40%';
Home.register();
