const keystone = require('keystone');

module.exports = function adminEditableUrl(user, options) {
  const rtn = keystone.app.locals.editable(user, {
    list: 'Post',
    id: options
  });
  return rtn;
};
