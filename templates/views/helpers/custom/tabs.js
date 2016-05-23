const Handlebars = require('handlebars');

module.exports = function tabs(tabsTotal, options = {}) {
  let out = '<ul class="slider">';
  const data = Handlebars.createFrame(options.data);

  for (let i = 0; i < tabsTotal; i++) {
    data.index = i;
    const parsedContent = options.fn(i, { data });
    out += createTab(parsedContent, i, tabsTotal);
  }

  out += '</ul>';
  return out;
};

function createTab(content, index, tabsTotal) {
  const labelToPrev = index > 0
    ? `<label for="img-${index - 1}" class="prev"><i class="fa fa-angle-left"></i></label>`
    : '';
  const labelToNext = index + 1 < tabsTotal
    ? `<label for="img-${index + 1}" class="next"><i class="fa fa-angle-right"></i></label>`
    : '';
  const checked = index === 0 ? 'checked' : '';

  const tab = `
  <input type="radio" name="radio-btn" id="img-${index}" ${checked} />
  <li class="slide-container">
    <div class="slide">
      ${content}
    </div>
    <div class="slider-nav">
      ${labelToPrev}
      ${labelToNext}
    </div>
  </li>`;
  return tab;
}
