const pageUrl = require('./pageUrl');

// special helper to ensure that we always have a valid next page url set
// even if the link is disabled, will default to totalPages
module.exports = function paginationNextUrl(nextPage, totalPages){
    if (nextPage === false) {
        nextPage = totalPages;
    }
    return pageUrl(nextPage);
};
