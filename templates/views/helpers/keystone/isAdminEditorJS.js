const hbs = require('handlebars');
const _ = require('underscore');
const scriptTemplate = _.template('<script src="<%= src %>"></script>');

module.exports = function isAdminEditorJS(user, options) {
  let output = '';
  if (typeof(user) !== 'undefined' && user.isAdmin) {
    output = scriptTemplate({
      src: '/keystone/js/content/editor.js'
    });
  }
  return new hbs.SafeString(output);
};
