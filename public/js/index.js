var babelHelpers = {};
babelHelpers.typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
};

babelHelpers.classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

babelHelpers.createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

babelHelpers;

// Bug checking function that will throw an error whenever
// the condition sent to it is evaluated to false
function assert(condition, errorMessage) {
  if (!condition) {
    var completeErrorMessage = '';

    if (assert.caller && assert.caller.name) {
      completeErrorMessage = assert.caller.name + ': ';
    }

    completeErrorMessage += errorMessage;
    throw new Error(completeErrorMessage);
  }
}

var Highlight = function () {
  function Highlight(el) {
    babelHelpers.classCallCheck(this, Highlight);

    this.setActive(el);
  }

  babelHelpers.createClass(Highlight, [{
    key: 'translateX',
    value: function translateX(val) {
      assert(typeof val === 'number', 'translateX value is not a number');
      this.bar.style.transform = 'translate3d(' + val + 'px, 0, 0)';
    }
  }, {
    key: 'setWidth',
    value: function setWidth(val) {
      assert(typeof val === 'number', 'translateX value is not a number');
      this.bar.style.width = val + 'px';
    }
  }, {
    key: 'getBaseXPosition',
    value: function getBaseXPosition() {
      var parentBox = this.parent.getBoundingClientRect();
      return parentBox.left;
    }
  }, {
    key: 'returnToBasePosition',
    value: function returnToBasePosition() {
      this.translateX(0);
      var parentBox = this.parent.getBoundingClientRect();
      var parentWidth = parentBox.right - parentBox.left;
      this.setWidth(parentWidth);
    }
  }, {
    key: 'moveToElementPosition',
    value: function moveToElementPosition(el) {
      var basePos = this.getBaseXPosition();
      var elBox = el.getBoundingClientRect();
      var displacement = elBox.left - basePos;
      this.translateX(displacement);
      var elWidth = elBox.right - elBox.left;
      this.setWidth(elWidth);
    }
  }, {
    key: 'setActive',
    value: function setActive(el) {
      if (this.bar) {
        this.bar.remove();
        this.bar = null;
      }

      assert(el && el.nodeName, 'Invalid element passed to setActive');
      this.parent = el;
      this.bar = document.createElement('div');
      this.bar.classList.add('active-highlight');
      this.parent.appendChild(this.bar);
    }
  }]);
  return Highlight;
}();

var ActiveHighlighter = function ActiveHighlighter() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var buttons = _ref.buttons;
  var _ref$activeIndex = _ref.activeIndex;
  var activeIndex = _ref$activeIndex === undefined ? 0 : _ref$activeIndex;
  var _ref$highlightOnClick = _ref.highlightOnClick;
  var highlightOnClick = _ref$highlightOnClick === undefined ? false : _ref$highlightOnClick;
  babelHelpers.classCallCheck(this, ActiveHighlighter);

  // NOTE: This module assumes that all tabs share a common parent.
  var buttonsArray = void 0;
  var tabsParent = void 0;

  if (buttons.nodeName) {
    // If tabs is a container, handle all children
    buttonsArray = Array.from(buttons.children);
    tabsParent = buttons;
  } else if (buttons.length) {
    // If tabs is arraylike handle all elements in the array.
    buttonsArray = Array.from(buttons);
    tabsParent = buttonsArray[0].parentElement;
  } else {
    throw new Error('Invalid element send to ActiveHighlighter.');
  }

  var activeHighlight = new Highlight(buttonsArray[activeIndex]);

  // Move highlight back to normal when mouse leaves buttons area
  tabsParent.addEventListener('mouseleave', function (e) {
    var tabsPartentBox = tabsParent.getBoundingClientRect();
    var outsideX = e.pageX > tabsPartentBox.right || e.pageX < tabsPartentBox.left;
    var outsideY = e.pageY > tabsPartentBox.bottom || e.pageY < tabsPartentBox.top;
    var mouseOutOfTabsParent = outsideX || outsideY;
    if (mouseOutOfTabsParent) {
      activeHighlight.returnToBasePosition();
    }
  });

  // Move highlight to the corresponding element on hover.
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    var _loop2 = function _loop2() {
      var item = _step.value;

      item.addEventListener('mouseenter', function () {
        activeHighlight.moveToElementPosition(item);
      });
    };

    for (var _iterator = buttonsArray[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      _loop2();
    }

    // Change main highlighted element on click if appropriate
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  if (highlightOnClick) {
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      var _loop = function _loop() {
        var item = _step2.value;

        item.addEventListener('click', function () {
          activeHighlight.setActive(item);
        });
      };

      for (var _iterator2 = buttonsArray[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        _loop();
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  }
};

var buttons = document.querySelectorAll('.tab-label');
var activeIndex = 0;
var highlightOnClick = true;
new ActiveHighlighter({ // eslint-disable-line no-new
  buttons: buttons,
  activeIndex: activeIndex,
  highlightOnClick: highlightOnClick
});

(function staffSlider() {
  var contentSelector = '.staffSlider-content';
  var rightArrowSelector = '.staffSlider-arrow-right';
  var leftArrowSelector = '.staffSlider-arrow-left';

  var content = document.querySelector(contentSelector);
  var rightArrow = document.querySelector(rightArrowSelector);
  var leftArrow = document.querySelector(leftArrowSelector);

  var ongoingAnimation = null;

  function scrollTo(value) {
    var container = arguments.length <= 1 || arguments[1] === undefined ? content : arguments[1];

    var currentScroll = container.scrollLeft;
    var scrollDiff = value - currentScroll;
    if (Math.abs(scrollDiff) < 10) {
      container.scrollLeft = value;
      return;
    }

    var easedDisplacement = scrollDiff / 8;
    var minimumDisplacement = 10;
    var displacement = scrollDiff > 0 ? Math.max(minimumDisplacement, easedDisplacement) : Math.min(-minimumDisplacement, easedDisplacement);
    var newScroll = currentScroll + displacement;

    container.scrollLeft = newScroll;
    ongoingAnimation = requestAnimationFrame(function () {
      return scrollTo(value, container);
    });
  }

  rightArrow.addEventListener('click', function () {
    window.cancelAnimationFrame(ongoingAnimation);
    var maxScroll = content.scrollWidth - content.clientWidth;
    var nextScrollPage = content.scrollLeft + content.clientWidth;
    var target = Math.min(maxScroll, nextScrollPage);
    scrollTo(target, content);
  });

  leftArrow.addEventListener('click', function () {
    window.cancelAnimationFrame(ongoingAnimation);
    var minScroll = 0;
    var nextScrollPage = content.scrollLeft - content.clientWidth;
    var target = Math.max(minScroll, nextScrollPage);
    scrollTo(target, content);
  });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJpbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZW52IGJyb3dzZXIgKi9cbmltcG9ydCBBY3RpdmVIaWdobGlnaHRlciBmcm9tICcuL19zaGFyZWQvQWN0aXZlSGlnaGxpZ2h0ZXInO1xuXG5jb25zdCBidXR0b25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYi1sYWJlbCcpO1xuY29uc3QgYWN0aXZlSW5kZXggPSAwO1xuY29uc3QgaGlnaGxpZ2h0T25DbGljayA9IHRydWU7XG5uZXcgQWN0aXZlSGlnaGxpZ2h0ZXIoeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ld1xuICBidXR0b25zLFxuICBhY3RpdmVJbmRleCxcbiAgaGlnaGxpZ2h0T25DbGlja1xufSk7XG5cbihmdW5jdGlvbiBzdGFmZlNsaWRlcigpIHtcbiAgY29uc3QgY29udGVudFNlbGVjdG9yID0gJy5zdGFmZlNsaWRlci1jb250ZW50JztcbiAgY29uc3QgcmlnaHRBcnJvd1NlbGVjdG9yID0gJy5zdGFmZlNsaWRlci1hcnJvdy1yaWdodCc7XG4gIGNvbnN0IGxlZnRBcnJvd1NlbGVjdG9yID0gJy5zdGFmZlNsaWRlci1hcnJvdy1sZWZ0JztcblxuICBjb25zdCBjb250ZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb250ZW50U2VsZWN0b3IpO1xuICBjb25zdCByaWdodEFycm93ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihyaWdodEFycm93U2VsZWN0b3IpO1xuICBjb25zdCBsZWZ0QXJyb3cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGxlZnRBcnJvd1NlbGVjdG9yKTtcblxuICBsZXQgb25nb2luZ0FuaW1hdGlvbiA9IG51bGw7XG5cbiAgZnVuY3Rpb24gc2Nyb2xsVG8odmFsdWUsIGNvbnRhaW5lciA9IGNvbnRlbnQpIHtcbiAgICBjb25zdCBjdXJyZW50U2Nyb2xsID0gY29udGFpbmVyLnNjcm9sbExlZnQ7XG4gICAgY29uc3Qgc2Nyb2xsRGlmZiA9IHZhbHVlIC0gY3VycmVudFNjcm9sbDtcbiAgICBpZiAoTWF0aC5hYnMoc2Nyb2xsRGlmZikgPCAxMCkge1xuICAgICAgY29udGFpbmVyLnNjcm9sbExlZnQgPSB2YWx1ZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBlYXNlZERpc3BsYWNlbWVudCA9IHNjcm9sbERpZmYgLyA4O1xuICAgIGNvbnN0IG1pbmltdW1EaXNwbGFjZW1lbnQgPSAxMDtcbiAgICBjb25zdCBkaXNwbGFjZW1lbnQgPSBzY3JvbGxEaWZmID4gMFxuICAgICAgPyBNYXRoLm1heChtaW5pbXVtRGlzcGxhY2VtZW50LCBlYXNlZERpc3BsYWNlbWVudClcbiAgICAgIDogTWF0aC5taW4oLW1pbmltdW1EaXNwbGFjZW1lbnQsIGVhc2VkRGlzcGxhY2VtZW50KTtcbiAgICBjb25zdCBuZXdTY3JvbGwgPSBjdXJyZW50U2Nyb2xsICsgZGlzcGxhY2VtZW50O1xuXG4gICAgY29udGFpbmVyLnNjcm9sbExlZnQgPSBuZXdTY3JvbGw7XG4gICAgb25nb2luZ0FuaW1hdGlvbiA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiBzY3JvbGxUbyh2YWx1ZSwgY29udGFpbmVyKSk7XG4gIH1cblxuICByaWdodEFycm93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZShvbmdvaW5nQW5pbWF0aW9uKTtcbiAgICBjb25zdCBtYXhTY3JvbGwgPSBjb250ZW50LnNjcm9sbFdpZHRoIC0gY29udGVudC5jbGllbnRXaWR0aDtcbiAgICBjb25zdCBuZXh0U2Nyb2xsUGFnZSA9IGNvbnRlbnQuc2Nyb2xsTGVmdCArIGNvbnRlbnQuY2xpZW50V2lkdGg7XG4gICAgY29uc3QgdGFyZ2V0ID0gTWF0aC5taW4obWF4U2Nyb2xsLCBuZXh0U2Nyb2xsUGFnZSk7XG4gICAgc2Nyb2xsVG8odGFyZ2V0LCBjb250ZW50KTtcbiAgfSk7XG5cbiAgbGVmdEFycm93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZShvbmdvaW5nQW5pbWF0aW9uKTtcbiAgICBjb25zdCBtaW5TY3JvbGwgPSAwO1xuICAgIGNvbnN0IG5leHRTY3JvbGxQYWdlID0gY29udGVudC5zY3JvbGxMZWZ0IC0gY29udGVudC5jbGllbnRXaWR0aDtcbiAgICBjb25zdCB0YXJnZXQgPSBNYXRoLm1heChtaW5TY3JvbGwsIG5leHRTY3JvbGxQYWdlKTtcbiAgICBzY3JvbGxUbyh0YXJnZXQsIGNvbnRlbnQpO1xuICB9KTtcbn0oKSk7XG4iXSwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
