/* eslint-env browser */
import ActiveHighlighter from './_shared/ActiveHighlighter';

const buttons = document.querySelectorAll('.tab-label');
const activeIndex = 0;
const highlightOnClick = true;
new ActiveHighlighter({ // eslint-disable-line no-new
  buttons,
  activeIndex,
  highlightOnClick
});

(function staffSlider() {
  const contentSelector = '.staffSlider-content';
  const rightArrowSelector = '.staffSlider-arrow-right';
  const leftArrowSelector = '.staffSlider-arrow-left';

  const content = document.querySelector(contentSelector);
  const rightArrow = document.querySelector(rightArrowSelector);
  const leftArrow = document.querySelector(leftArrowSelector);

  let ongoingAnimation = null;

  function scrollTo(value, container = content) {
    const currentScroll = container.scrollLeft;
    const scrollDiff = value - currentScroll;
    if (Math.abs(scrollDiff) < 10) {
      container.scrollLeft = value;
      return;
    }

    const easedDisplacement = scrollDiff / 8;
    const minimumDisplacement = 10;
    const displacement = scrollDiff > 0
      ? Math.max(minimumDisplacement, easedDisplacement)
      : Math.min(-minimumDisplacement, easedDisplacement);
    const newScroll = currentScroll + displacement;

    container.scrollLeft = newScroll;
    ongoingAnimation = requestAnimationFrame(() => scrollTo(value, container));
  }

  rightArrow.addEventListener('click', () => {
    window.cancelAnimationFrame(ongoingAnimation);
    const maxScroll = content.scrollWidth - content.clientWidth;
    const nextScrollPage = content.scrollLeft + content.clientWidth;
    const target = Math.min(maxScroll, nextScrollPage);
    scrollTo(target, content);
  });

  leftArrow.addEventListener('click', () => {
    window.cancelAnimationFrame(ongoingAnimation);
    const minScroll = 0;
    const nextScrollPage = content.scrollLeft - content.clientWidth;
    const target = Math.max(minScroll, nextScrollPage);
    scrollTo(target, content);
  });
}());
