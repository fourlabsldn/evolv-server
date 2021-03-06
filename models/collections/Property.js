const keystone = require('keystone');
const Types = keystone.Field.Types;
const logger = require('../utils/logger');
/**
 * Property Model
 * ==========
 */

const Property = new keystone.List('Property', {
	map: { name: 'location.street1' },
	autokey: { path: 'slug', from: 'location.postcode', unique: true },
	defaultSort: '-location'
});

Property.add({
  location: {
    type: Types.Location,
    defaults: { country: 'United Kingdom' },
    required: true,
    initial: true
  },
	images: { type: Types.CloudinaryImages },
	floorPlan: { type: Types.CloudinaryImage },
	epc: { type: Types.CloudinaryImage },
  buy: {
    available: { type: Boolean, label: 'Available for sale' },
		featured: { type: Boolean, label: 'Sales Featured' },
    price: { type: Types.Money, currency: 'en-gb', label: 'Sales Price' }
  },
  rent: {
    available: { type: Boolean, label: 'Available to let' },
		featured: { type: Boolean, label: 'Letting Featured' },
    price: { type: Types.Money, currency: 'en-gb', label: 'Lettings Price' }
  },
  bedrooms: { type: Number },
  size: { type: Number, label: 'Size (sq ft)' },
  type: {
    type: Types.Select,
    index: true,
    options: [
      { value: 'house', label: 'House' },
      { value: 'apartment', label: 'Apartment' },
      { value: 'office', label: 'Office' }
    ] },
    ownership: {
      type: Types.Select, options: [
        { value: 'freehold', label: 'Freehold' },
        { value: 'leasehold', label: 'Leasehold' },
				{ value: 'share of freehold', label: 'Share of Freehold' }
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
  return geo[1];
});

Property.schema.virtual('location.longitude').get(function () {
  const geo = this.location.geo || [];
  return geo[0];
});

Property.schema.virtual('hasGeoInfo').get(function () {
  const geo = this.location.geo || [];
  return geo.length > 0;
});

function setPropertyCoordinates(next) {
  // Insert geolocation data
  const region = 'United Kingdom';
  const updateRecord = 'overwrite';
  this._.location.googleLookup(region, updateRecord, (err) => {
    if (err) {
      logger.warn(err);
    }
    next();
  });
}
Property.schema.pre('save', setPropertyCoordinates);

/**
 * Collection functions
 */

/**
 * @method getFeatured
 * @return {Promise} Will resolve into an array or featured properties
 */
Property.getFeatured = function () {
  return this.findWhere({ $or: [{ 'buy.featured': true }, { 'rent.featured': true }] });
};


Property.defaultColumns = 'location|70%, type|20%';
Property.register();
