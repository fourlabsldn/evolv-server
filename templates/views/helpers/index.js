/* eslint-disable global-require */
const Swag = require('swag');

module.exports = function () {
	const _helpers = {}; // eslint-disable-line no-underscore-dangle

  // =========================================================================
  // Keystone Helpers
  // =========================================================================
  _helpers.date = require('./keystone/date');
  _helpers.ifeq = require('./keystone/ifeq');
  _helpers.categoryList = require('./keystone/categoryList');
  // block rendering for keystone admin js
  _helpers.isAdminEditorJS = require('./keystone/isAdminEditorJS');
	// block rendering for keystone admin css
	_helpers.isAdminEditorCSS = require('./keystone/isAdminEditorCSS');
	// Used to generate the link for the admin edit post button
	_helpers.adminEditableUrl = require('./keystone/adminEditableUrl');
	_helpers.cloudinaryUrl = require('./keystone/cloudinaryUrl');
	_helpers.postUrl = require('./keystone/postUrl');
	_helpers.pageUrl = require('./keystone/pageUrl');
	// create the category url for a blog-category page
	_helpers.categoryUrl = require('./keystone/categoryUrl');

  // ### Pagination Helpers
	_helpers.ifHasPagination = require('./keystone/ifHasPagination');
	_helpers.paginationNavigation = require('./keystone/paginationNavigation');
  // special helper to ensure that we always have a valid page url set even if
  // the link is disabled, will default to page 1
  _helpers.paginationPreviousUrl = require('./keystone/paginationPreviousUrl');
  // special helper to ensure that we always have a valid next page url set
  // even if the link is disabled, will default to totalPages
  _helpers.paginationNextUrl = require('./keystone/paginationNextUrl');
	_helpers.flashMessages = require('./keystone/flashMessages');
	//  ### underscoreMethod call + format helper
	_helpers.underscoreFormat = require('./keystone/underscoreFormat');


	// =========================================================================
	// Evolv Helpers
	// =========================================================================
	_helpers.propertyUnavailableMessage = require('./custom/propertyUnavailableMessage');
  _helpers.propertyPrice = require('./custom/propertyPrice');
	_helpers.formatCurrency = require('./custom/formatCurrency');
	_helpers.formatSize = require('./custom/formatSize');
  _helpers.tabs = require('./custom/tabs');
  _helpers.detailsList = require('./custom/detailsList');
  _helpers.feetToMeters = require('./custom/feetToMeters');
  _helpers.srcSet = require('./custom/srcSet');

	// Register library helpers
	const helperRegisterer = {
		registerHelper(helperName, helperFunc) {
			_helpers[helperName] = helperFunc;
		}
	};

	Swag.registerHelpers(helperRegisterer);

	return _helpers;
};
