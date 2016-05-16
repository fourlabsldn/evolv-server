const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * Home Model
 * =============
 */

const Home = new keystone.List('Home', {
	// nocreate: true,
  // nodelete: true
});

Home.add(
  {
    page_name: { type: Types.Text, hidden: true, default: 'Home', required: true }
  },
  'Section 1',
  {
    section_1: {
      main_heading: { type: Types.Text, required: true, default: 'CONSTANTLY EVOLV(ING)', label: 'Main heading' },
      main_subheading: { type: Types.Text, required: true, default: 'Luxury London Living', label: 'Main subheading' },
    }
  },
  'Sectio 2',
  {
    section_2: {
      heading: { type: Types.Text, required: true, default: 'A little history of Evolv.', label: 'Heading' },
      content: { type: Types.Textarea, height: 500, label: 'Content'  },
      tab_1: {
        title: { type: Types.Text, required: true, default: 'Item 1', label: 'Tab 1 - Heading' },
        content: { type: Types.Textarea, height: 400, label: 'Tab 1 - Content' }
      },
      tab_2: {
        title: { type: Types.Text, required: true, default: 'Item 2', label: 'Tab 2 - Heading' },
        content: { type: Types.Textarea, height: 400, label: 'Tab 2 - Content' }
      },
      tab_3: {
        title: { type: Types.Text, required: true, default: 'Item 3', label: 'Tab 3 - Heading' },
        content: { type: Types.Textarea, height: 400, label: 'Tab 3 - Content' }
      },
      tab_4: {
        title: { type: Types.Text, required: true, default: 'Item 4', label: 'Tab 4 - Heading' },
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

Home.defaultColumns = 'section_1.main_heading, section_1.main_subheading';
Home.register();
