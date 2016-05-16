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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJpbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQWN0aXZlSGlnaGxpZ2h0ZXIgZnJvbSAnLi9fc2hhcmVkL0FjdGl2ZUhpZ2hsaWdodGVyJztcblxuY29uc3QgYnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWItbGFiZWwnKTtcbmNvbnN0IGFjdGl2ZUluZGV4ID0gMDtcbmNvbnN0IGhpZ2hsaWdodE9uQ2xpY2sgPSB0cnVlO1xubmV3IEFjdGl2ZUhpZ2hsaWdodGVyKHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXdcbiAgYnV0dG9ucyxcbiAgYWN0aXZlSW5kZXgsXG4gIGhpZ2hsaWdodE9uQ2xpY2ssXG59KTtcbiJdLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
