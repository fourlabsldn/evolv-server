const cloudinaryUrl = require('../keystone/cloudinaryUrl');

module.exports = function srcSet(cloudinaryImage, ...widths) {
  let urlSet = '';
  widths.forEach((width) => {
    if (typeof width !== 'number') { return; }
    const options = {
      hash: {
        width,
        crop: 'lfill',
        gravity: 'center'
      }
    };
    const url = cloudinaryUrl(cloudinaryImage, options);
    urlSet += `\n ${url} ${width}w,`;
  });

  return urlSet;
};
