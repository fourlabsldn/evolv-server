var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Property Model
 * ==========
 */

var Property = new keystone.List('Property', {
	map: { name: 'postcode' },
	autokey: { path: 'slug', from: 'postcode', unique: true }
});

Property.add({
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
      { value: 'office', label: 'Office' },
    ] },
  summary: { type: Types.Html, wysiwyg: true, height: 150 },
  description: { type: Types.Html, wysiwyg: true, height: 400 },
  ownership: {
    type: Types.Select, options: [
      { value: 'freehold', label: 'Freehold' },
      { value: 'leasehold', label: 'Leasehold' },
    ] },
  image: { type: Types.CloudinaryImage },
  postcode: { type: String, required: true, initial: true },
  houseNumber: { type: String },
  street: { type: String },
  area: { type: String },
  city: { type: String },
  country: { type: String },
});

Property.defaultColumns = 'street, houseNumber|20%, postcode|20%, type|20%';
Property.register();
