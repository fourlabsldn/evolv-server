const hbs = require('handlebars');
const _ = require('underscore');
const cssLinkTemplate = _.template('<link href="<%= href %>" rel="stylesheet">');

// block rendering for keystone admin css
module.exports = function isAdminEditorCSS(user, options) {
  let output = '';
  if (typeof(user) !== 'undefined' && user.isAdmin) {
    output = cssLinkTemplate({
      href: '/keystone/styles/content/editor.min.css'
    });
  }
  return new hbs.SafeString(output);
};
