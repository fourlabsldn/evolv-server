//  ### underscoreMethod call + format helper
//	Calls to the passed in underscore method of the object (Keystone Model)
//	and returns the result of format()
//
//  @obj: The Keystone Model on which to call the underscore method
//	@undescoremethod: string - name of underscore method to call
//
//  *Usage example:*
//  `{{underscoreFormat enquiry 'enquiryType'}}

module.exports = function underscoreFormat(obj, underscoreMethod) {
  return obj._[underscoreMethod].format();
};
