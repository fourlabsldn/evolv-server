// standard hbs equality check, pass in two values from template
// {{#ifeq keyToCheck data.myKey}} [requires an else blockin template regardless]
module.exports = function ifeq(a, b, options) {
  if (a == b) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
};
