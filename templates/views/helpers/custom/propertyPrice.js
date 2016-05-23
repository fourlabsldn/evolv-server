const formatCurrency = require('./formatCurrency');

module.exports = function propertyPrice(property, acquisitionMode) {
  if (!(property && acquisitionMode)) {
    return '';
  }
  const price = property[acquisitionMode].price;
  return formatCurrency(price);
};
