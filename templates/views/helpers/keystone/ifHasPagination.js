const _ = require('underscore');
/*
* expecting the data.posts context or an object literal that has `previous` and `next` properties
* ifBlock helpers in hbs - http://stackoverflow.com/questions/8554517/handlerbars-js-using-an-helper-function-in-a-if-statement
* */
module.exports = function ifHasPagination(postContext, options) {
  // if implementor fails to scope properly or has an empty data set
  // better to display else block than throw an exception for undefined
  if (_.isUndefined(postContext)) {
    return options.inverse(this);
  }
  if (postContext.next || postContext.previous) {
    return options.fn(this);
  }
  return options.inverse(this);
};
