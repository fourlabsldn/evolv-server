const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * Property Model
 * ==================
 */

const Property = new keystone.List('Property', {
  autokey: { path: 'key', from: 'name', unique: true }
});

Property.add({
  name: { type: String, required: true },
  sell: { type: Boolean },
  rent: { type: Boolean },
  bedrooms: { type: Number },
  size: { type: Number },
  type: { type: Types.Select, options: [
    { value: 'apartment', label: 'House' },
		{ value: 'house', label: 'Apartment' },
  ] },
  summary: { type: Boolean, wysiwyg: true, height: 150 },
  description: { type: String, wysiwyg: true, height: 400 },
  location: { type: String },
  ownership: { type: Types.Select, options: [
    { value: 'freehold', label: 'Freehold' },
		{ value: 'leasehold', label: 'Leasehold' },
  ] },
  address: {
    postcode: { type: String },
    houseNumber: { type: String },
    street: { type: String },
    area: { type: String },
    city: { type: String },
    country: { type: String },
  }
});

Property.defaultColumns = 'name';
Property.register();
