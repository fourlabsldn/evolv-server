import ActiveHighlighter from './_shared/ActiveHighlighter';

const buttons = document.querySelectorAll('.tab-label');
const activeIndex = 0;
const highlightOnClick = true;
new ActiveHighlighter({ // eslint-disable-line no-new
  buttons,
  activeIndex,
  highlightOnClick,
});
