module.exports = function detailsList(details = []) {
  let list = '';
  for (const key of Object.keys(details)) {
    const text = details[key];
    if (!text || typeof text !== 'string') {
      continue;
    }
    list += `\n<li>${text}</li>`;
  }

  return list;
};
