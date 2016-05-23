module.exports = function propertyUnavailableMessage(property) {
  let message;
  if (!property.buy.availble && !property.rent.available) {
    message = 'This property is not available.';
  } else if (!property.buy.availble) {
    message = 'This property is not for sale, it is only available to be rented.';
  } else {
    message = 'This property is only available for sale, it is not available to be rented.';
  }
  return message;
};
