const keystone = require('keystone');
const Types = keystone.Field.Types;
/**
 * Property Model
 * ==========
 */

const Property = new keystone.List('Property', {
	map: { name: 'location.street1' },
	autokey: { path: 'slug', from: 'location.postcode', unique: true }
});

Property.add({
  featured: { type: Boolean },
  location: {
    type: Types.Location,
    defaults: { country: 'United Kingdom' },
    required: true,
    initial: true
  },
	images: { type: Types.CloudinaryImages },
	floorPlan: { type: Types.CloudinaryImage },
	epc: { type: Types.CloudinaryImage },
  sell: {
    available: { type: Boolean },
    price: { type: Types.Money, currency: 'en-gb', dependsOn: { 'sell.available': true } }
  },
  rent: {
    available: { type: Boolean },
    price: { type: Types.Money, currency: 'en-gb', dependsOn: { 'rent.available': true } }
  },
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
    ownership: {
      type: Types.Select, options: [
        { value: 'freehold', label: 'Freehold' },
        { value: 'leasehold', label: 'Leasehold' }
      ] },
  details: {
    1: { type: Types.Text },
    2: { type: Types.Text },
    3: { type: Types.Text },
    4: { type: Types.Text },
    5: { type: Types.Text },
    6: { type: Types.Text }
  },
  summary: { type: Types.Html, wysiwyg: true, height: 150 },
	description: { type: Types.Html, wysiwyg: true, height: 400 },
  locationDescription: { type: Types.Html, wysiwyg: true, height: 400 }
});

Property.schema.virtual('location.latitude').get(function () {
  const geo = this.location.geo || [];
  return geo[0];
});

Property.schema.virtual('location.longitude').get(function () {
  const geo = this.location.geo || [];
  return geo[1];
});

Property.schema.virtual('hasGeoInfo').get(function () {
  const geo = this.location.geo || [];
  return geo.length > 0;
});

Property.schema.pre('save', function (next) {
  // Insert geolocation data
  const region = 'United Kingdom';
  const updateRecord = true;
  this._.location.googleLookup(region, updateRecord, () => {
    next();
  });
});

/**
 * Collection functions
 */

/**
 * @method getFeatured
 * @return {Promise} Will resolve into an array or featured properties
 */
Property.getFeatured = function () {
  return this.findWhere('featured', true);
};


Property.defaultColumns = 'location|70%, type|20%';
Property.register();
