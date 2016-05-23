const pageUrl = require('./pageUrl');

module.exporst = function paginationPreviousUrl(previousPage, totalPages){
    if (previousPage === false) {
        previousPage = 1;
    }
    return pageUrl(previousPage);
};
