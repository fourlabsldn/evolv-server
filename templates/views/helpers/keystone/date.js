const moment = require('moment');

/**
 * Port of Ghost helpers to support cross-theming
 * ==============================================
 *
 * Also used in the default keystonejs-hbs theme
 */

// ### Date Helper
// A port of the Ghost Date formatter similar to the keystonejs - jade interface
//
//
// *Usage example:*
// `{{date format='MM YYYY}}`
// `{{date publishedDate format='MM YYYY'`
//
// Returns a string formatted date
// By default if no date passed into helper than then a current-timestamp is used
//
// Options is the formatting and context check this.publishedDate
// If it exists then it is formated, otherwise current timestamp returned

module.exports = function date(context, options) {
  if (!options && context.hasOwnProperty('hash')) {
    options = context;
    context = undefined;

    if (this.publishedDate) {
      context = this.publishedDate;
    }
  }

  // ensure that context is undefined, not null, as that can cause errors
  context = context === null ? undefined : context;

  const f = options.hash.format || 'MMM Do, YYYY';
  const timeago = options.hash.timeago;
  let aDate;

  // if context is undefined and given to moment then current timestamp is given
  // nice if you just want the current year to define in a tmpl
  if (timeago) {
    aDate = moment(context).fromNow();
  } else {
    aDate = moment(context).format(f);
  }
  return aDate;
};
