const _ = require('underscore');
const hbs = require('handlebars');
const linkTemplate = _.template('<a href="<%= url %>"><%= text %></a>');


// ### Category Helper
// Ghost uses Tags and Keystone uses Categories
// Supports same interface, just different name/semantics
//
// *Usage example:*
// `{{categoryList categories separator=' - ' prefix='Filed under '}}`
//
// Returns an html-string of the categories on the post.
// By default, categories are separated by commas.
// input. categories:['tech', 'js']
// output. 'Filed Undder <a href="blog/tech">tech</a>, <a href="blog/js">js</a>'

module.exports = function categoryList(categories, options) {
  const autolink = _.isString(options.hash.autolink) && options.hash.autolink === "false" ? false : true;
  const separator = _.isString(options.hash.separator) ? options.hash.separator : ', ';
  const prefix = _.isString(options.hash.prefix) ? options.hash.prefix : '';
  const suffix = _.isString(options.hash.suffix) ? options.hash.suffix : '';
  let output = '';

  function createTagList(tags) {
    const tagNames = _.pluck(tags, 'name');

    if (autolink) {
      return _.map(tags, function (tag) {
        return linkTemplate({
          url: ('/blog/' + tag.key),
          text: _.escape(tag.name)
        });
      }).join(separator);
    }
    return _.escape(tagNames.join(separator));
  }

  if (categories && categories.length) {
    output = prefix + createTagList(categories) + suffix;
  }
  return new hbs.SafeString(output);
};
