const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * Property Model
 * ==========
 */

const Property = new keystone.List('Property', {
	map: { name: 'postcode' },
	autokey: { path: 'slug', from: 'postcode', unique: true }
});

Property.add({
	image: { type: Types.CloudinaryImage },
	floorPlan: { type: Types.CloudinaryImage },
	epc: { type: Types.CloudinaryImage },
  price: { type: Number },
  sell: { type: Boolean },
  rent: { type: Boolean },
  bedrooms: { type: Number },
  size: { type: Number },
  type: {
    type: Types.Select,
    index: true,
    options: [
      { value: 'apartment', label: 'House' },
      { value: 'house', label: 'Apartment' },
      { value: 'office', label: 'Office' }
    ] },
  summary: { type: Types.Html, wysiwyg: true, height: 150 },
	description: { type: Types.Html, wysiwyg: true, height: 400 },
  locationDescription: { type: Types.Html, wysiwyg: true, height: 400 },
  ownership: {
    type: Types.Select, options: [
      { value: 'freehold', label: 'Freehold' },
      { value: 'leasehold', label: 'Leasehold' }
    ] },
  postcode: { type: String, required: true, initial: true },
  houseNumber: { type: String },
  street: { type: String },
  city: { type: String },
  country: { type: String }
});

Property.defaultColumns = 'street, houseNumber|20%, postcode|20%, type|20%';
Property.register();
