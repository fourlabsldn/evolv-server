module.exports = function formatCurrency(rawNumber) {
  const num = Number(rawNumber);
  const result = num
    ? num.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })
    : '';
  return result;
};
