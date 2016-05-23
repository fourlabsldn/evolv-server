const cloudinary = require('cloudinary');
const placeholderImage = '/img/property-placeholder.svg';

// ### CloudinaryUrl Helper
// Direct support of the cloudinary.url method from Handlebars (see
// cloudinary package documentation for more details).
//
// *Usage examples:*
// `{{{cloudinaryUrl image width=640 height=480 crop='fill' gravity='north'}}}`
// `{{#each images}} {{cloudinaryUrl width=640 height=480}} {{/each}}`
//
// Returns an src-string for a cloudinary image or for a default placeholder image

module.exports = function cloudinaryUrl(context, options) {
  // if we dont pass in a context and just kwargs
  // then `this` refers to our default scope block and kwargs
  // are stored in context.hash
  if (!options && context.hasOwnProperty('hash')) {
    // strategy is to place context kwargs into options
    options = context;
    // bind our default inherited scope into context
    context = this;
  }

  options = options || {};
  options.hash.flags = options.hash.flags
      ? options.hash.flags + ', progressive'
      : 'progressive';

  if ((context) && (context.public_id)) {
    const imageName = context.public_id.concat('.', context.format);
    return cloudinary.url(imageName, options.hash);
  }

  return placeholderImage;
};
