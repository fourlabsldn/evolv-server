module.exports = function feetToMeters(value = 0) {
  const conversionFactor = 0.092903;
  return Math.floor(value * conversionFactor);
};
