// might be a ghost helper
// used for pagination urls on blog
module.exports = function pageUrl(pageNumber, options) {
  return '/blog?page=' + pageNumber;
};
