const _ = require('underscore');
const linkTemplate = _.template('<a href="<%= url %>"><%= text %></a>');
const pageUrl = require('./pageUrl');

module.exports = function paginationNavigation(pages, currentPage, totalPages, options){
  let html = '';

  // pages should be an array ex.  [1,2,3,4,5,6,7,8,9,10, '....']
  // '...' will be added by keystone if the pages exceed 10
  _.each(pages, (page, ctr) => {
    // create ref to page, so that '...' is displayed as text even though int value is required
    const pageText = page;
    // create boolean flag state if currentPage
    const isActivePage = (page === currentPage);
    // need an active class indicator
    const liClass = ((isActivePage) ? ' class="active"' : '');

    // if '...' is sent from keystone then we need to override the url
    if (page === '...') {
      // check position of '...' if 0 then return page 1, otherwise use totalPages
      page = ((ctr) ? totalPages : 1);
    }

    // get the pageUrl using the integer value
    const pUrl = pageUrl(page);

    // wrapup the html
    html += '<li' + liClass + '>' + linkTemplate({ url: pUrl, text: pageText }) + '</li>\n';
  });
  return html;
};
