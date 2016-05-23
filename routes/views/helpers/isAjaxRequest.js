module.exports = function isAjaxRequest(req) {
  // Render the view
  const ajaxSources = ['XMLHttpRequest', 'fetch'];
  const requestSource = req.headers['x-requested-with'];
  const pageRequestedViaAjax = ajaxSources.indexOf(requestSource) > -1;
  return pageRequestedViaAjax;
};
