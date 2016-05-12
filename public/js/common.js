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

var modalHiddenClass = 'modal--hidden';
var modalContentSelector = '.modal-content';

var ModalController = function () {
  function ModalController(modalEl, toggleButton) {
    var _this = this;

    babelHelpers.classCallCheck(this, ModalController);

    assert(modalEl, 'No modal element provided');
    this.modalEl = modalEl;

    this.modalContent = modalEl.querySelector(modalContentSelector);
    assert(this.modalContent, 'No modal content element found.');

    if (toggleButton) {
      this.toggleButton = toggleButton;
      this.toggleButton.addEventListener('click', function () {
        return _this.isOpen() ? _this.close() : _this.open();
      });
    }

    this.controllerClickListener = this.closeController.bind(this);

    // Set listeners for current state
    if (this.isOpen()) {
      this.open();
    } else {
      this.close();
    }
  }

  babelHelpers.createClass(ModalController, [{
    key: 'isOpen',
    value: function isOpen() {
      return !this.modalEl.classList.contains(modalHiddenClass);
    }
  }, {
    key: 'open',
    value: function open() {
      this.modalEl.classList.remove(modalHiddenClass);
      // Click has to be in the capturing phase, otherwise the bubbling click from
      // the toggle button will immediately close the modal.
      document.body.addEventListener('click', this.controllerClickListener, true);
    }
  }, {
    key: 'close',
    value: function close() {
      this.modalEl.classList.add(modalHiddenClass);
      document.body.removeEventListener('click', this.controllerClickListener, true);
    }
  }, {
    key: 'closeController',
    value: function closeController(e) {
      var modalOpen = this.isOpen();
      if (this.clickIsOutsideContent(e) && modalOpen) {
        this.close();
      } else if (!modalOpen) {
        assert(false, 'Problem in openCloseController. Triggered with modal closed.');
      }
    }
  }, {
    key: 'clickIsOutsideContent',
    value: function clickIsOutsideContent(e) {
      var contentRect = this.modalContent.getBoundingClientRect();

      var insideVertically = contentRect.top < e.pageY && e.pageY < contentRect.bottom;
      var insideHorizontally = contentRect.left < e.pageX && e.pageX < contentRect.right;

      console.log('Click inside ' + (insideVertically && insideHorizontally));
      return !(insideVertically && insideHorizontally);
    }
  }]);
  return ModalController;
}();

function hideAndShow() {
  var toggleNavbarBtn = document.querySelector('.js-navbar-toggle-button');
  var navbar = document.querySelector('.navbar');
  var showNavbarClass = 'show-navbar';

  var minimumDelay = 100;
  var lastNavbarChange = Date.now();
  function enoughDelay() {
    if (Date.now() - lastNavbarChange < minimumDelay) {
      return false;
    }
    lastNavbarChange = Date.now();
    return true;
  }

  function isSmallScreen() {
    return window.innerWidth <= 768;
  }

  function showNavbar() {
    document.body.classList.add(showNavbarClass);
  }

  function hideNavbar() {
    document.body.classList.remove(showNavbarClass);
  }

  toggleNavbarBtn.addEventListener('mouseenter', function () {
    if (!isSmallScreen() && enoughDelay()) {
      showNavbar();
    }
  });

  navbar.addEventListener('mouseleave', function () {
    if (!isSmallScreen() && enoughDelay()) {
      hideNavbar();
    }
  });
}

function activeButton(pageNameParam) {
  var pageName = void 0;
  var navbarActiveButton = void 0;
  var buttonsContainer = document.querySelector('.navigation-buttons');

  // First we try and get the page name from a parameter
  if (pageNameParam) {
    pageName = pageNameParam;
    pageName = CSS.escape(pageName);
    navbarActiveButton = buttonsContainer.querySelector('[name=' + pageName + ']');
  }

  // If it wasn't successfull we try to get it from a global object
  if (!navbarActiveButton && (typeof PAGE_INFO === 'undefined' ? 'undefined' : babelHelpers.typeof(PAGE_INFO)) === 'object' && typeof PAGE_INFO.name === 'string') {
    pageName = PAGE_INFO.name;
    pageName = CSS.escape(pageName);
    navbarActiveButton = buttonsContainer.querySelector('[name=' + pageName + ']');
    // Then we just say it is home.
  }

  // If we still don't have it let's try to guess from the url.
  if (!navbarActiveButton) {
    var pathname = location.pathname;
    var pageNameRegex = /\/([^\.]+)(?:\..*)?$/;
    var pageNameMatch = pathname.match(pageNameRegex) || [];
    pageName = pageNameMatch[1];
    pageName = CSS.escape(pageName);
    navbarActiveButton = buttonsContainer.querySelector('[name=' + pageName + ']');
  }

  // If we still didn't get anything, let's not activate the highlighter.
  if (!navbarActiveButton) {
    return;
  }
  assert(navbarActiveButton, 'Error finding navbar\'s active button.');

  // Get all navigation buttons
  var navbarButtons = buttonsContainer.querySelectorAll('li');
  assert(navbarButtons && navbarButtons.length > 0, 'No navigation buttons found');
  navbarButtons = Array.from(navbarButtons);

  // Remove items with navigation buttons from navbarButton array
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = navbarButtons[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var item = _step.value;

      if (item.querySelector('.navbar-button')) {
        var itemIndex = navbarButtons.indexOf(item);
        navbarButtons.splice(itemIndex, 1);
      }
    }

    // Handle highlight in these buttons
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

  new ActiveHighlighter({ // eslint-disable-line no-new
    buttons: navbarButtons,
    activeIndex: navbarButtons.indexOf(navbarActiveButton),
    highlightOnClick: true
  });
}

// Assigns an event listener to searchBar;
function initSearchBarToggle() {
  var searchButtonSelector = '.website-search';
  var searchButton = document.querySelector(searchButtonSelector);
  assert(searchButton && searchButton.nodeName, 'No search button found.');

  var navbarContainerSelector = '.navbar-container';
  var navbarContainer = document.querySelector(navbarContainerSelector);
  assert(navbarContainer && navbarContainer.nodeName, 'No navbar container found.');

  var navbarDropdownSelector = '.navbar-dropdown-search';
  var navbarDropdown = document.querySelector(navbarDropdownSelector);
  assert(navbarDropdown && navbarDropdown.nodeName, 'No navbar dropdown found.');

  function showSearchBar() {
    navbarContainer.classList.add(searchBarOpenClass);
    document.body.addEventListener('click', searchDismiss);
  }

  function hideSearchBar() {
    navbarContainer.classList.remove(searchBarOpenClass);
    document.body.removeEventListener('click', searchDismiss);
  }

  // dismiss search bar when clicking anywhere else in the website.
  function searchDismiss(e) {
    var dropdownBox = navbarDropdown.getBoundingClientRect();
    var clickWidthinX = e.clientX < dropdownBox.right && e.clientX > dropdownBox.left;
    var clickWidthinY = e.clientY < dropdownBox.bottom && e.clientY > dropdownBox.top;
    if (!clickWidthinY || !clickWidthinX) {
      hideSearchBar();
    }
  }

  var searchBarOpenClass = 'dropdown-search-open';
  searchButton.addEventListener('click', function (e) {
    if (navbarContainer.classList.contains(searchBarOpenClass)) {
      hideSearchBar();
    } else {
      // If we don't stop the propagation, the dismiss event will be
      // fired for this same click.
      e.stopPropagation();
      showSearchBar();
    }
  });
}

function initSearchBarButtons() {
  var searchFormSelector = '.js-navbar-dropdown-search';
  var searchForm = document.querySelector(searchFormSelector);
  assert(searchForm && searchForm.nodeName, 'No search form found.');

  var rentBtnSelector = '.js-navbar-dropdow-search-rent-btn';
  var rentBtnTarget = '/rent';
  var rentBtn = document.querySelector(rentBtnSelector);
  assert(rentBtn && rentBtn.nodeName, 'No rent button found.');

  rentBtn.addEventListener('click', function () {
    searchForm.action = rentBtnTarget;
    searchForm.submit();
  });

  // Setup valuation modal
  var valuationModalSelector = '.js-navbar-modal-valuation-modal';
  var valuationModal = document.querySelector(valuationModalSelector);
  assert(valuationModal && valuationModal.nodeName, 'No valuation modal found.');

  var modalToggleSelector = '.js-valuation-modal-toggle';
  var modalToggle = document.querySelector(modalToggleSelector);

  new ModalController(valuationModal, modalToggle); // eslint-disable-line no-new
}

function controlNavbar(pageName) {
  hideAndShow();
  activeButton(pageName);
  initSearchBarToggle();
  initSearchBarButtons();
}

var Elevator = function Elevator(n) {
  "use strict";
  function t(n, t, e, o) {
    return n /= o / 2, 1 > n ? e / 2 * n * n + t : (n--, -e / 2 * (n * (n - 2) - 1) + t);
  }function e(n, t) {
    for (var e in t) {
      var o = void 0 === n[e] && "function" != typeof e;o && (n[e] = t[e]);
    }return n;
  }function o(n) {
    for (var t = 0; n;) {
      t += n.offsetTop || 0, n = n.offsetParent;
    }return t;
  }function l(n) {
    T || (T = n);var e = n - T,
        o = t(e, k, C - k, b);window.scrollTo(0, o), b > e ? w = requestAnimationFrame(l) : r();
  }function i() {
    return window.requestAnimationFrame && window.Audio && window.addEventListener;
  }function u() {
    T = null, k = null, h = !1;
  }function a() {
    y && (C = o(y));
  }function r() {
    u(), f && (f.pause(), f.currentTime = 0), A && A.play(), p && p();
  }function d() {
    h && (cancelAnimationFrame(w), u(), f && (f.pause(), f.currentTime = 0), a(), window.scrollTo(0, C));
  }function c(n) {
    n.addEventListener ? n.addEventListener("click", F.elevate, !1) : n.attachEvent("onclick", function () {
      a(), document.documentElement.scrollTop = C, document.body.scrollTop = C, window.scroll(0, C);
    });
  }function s(n) {
    v = document.body;var t = { duration: void 0, mainAudio: !1, endAudio: !1, preloadAudio: !0, loopAudio: !0, startCallback: null, endCallback: null };n = e(n, t), n.element && c(n.element), i() && (n.duration && (E = !0, b = n.duration), n.targetElement && (y = n.targetElement), window.addEventListener("blur", d, !1), n.mainAudio && (f = new Audio(n.mainAudio), f.setAttribute("preload", n.preloadAudio), f.setAttribute("loop", n.loopAudio)), n.endAudio && (A = new Audio(n.endAudio), A.setAttribute("preload", "true")), n.endCallback && (p = n.endCallback), n.startCallback && (m = n.startCallback));
  }var m,
      f,
      A,
      p,
      v = null,
      w = null,
      b = null,
      E = !1,
      T = null,
      k = null,
      C = 0,
      y = null,
      h = !1,
      F = this;this.elevate = function () {
    h || (h = !0, k = document.documentElement.scrollTop || v.scrollTop, a(), E || (b = 1.5 * Math.abs(C - k)), requestAnimationFrame(l), f && f.play(), m && m());
  }, s(n);
};

controlNavbar();

window.elevator = Elevator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjb21tb24uanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG5hdmJhckNvbnRyb2wgZnJvbSAnLi9fY29tbW9uL25hdmJhci5qcyc7XG5uYXZiYXJDb250cm9sKCk7XG5cbmltcG9ydCBlbGV2YXRvciBmcm9tICcuL19jb21tb24vZWxldmF0b3IuanMnO1xud2luZG93LmVsZXZhdG9yID0gZWxldmF0b3I7XG4iXSwiZmlsZSI6ImNvbW1vbi5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
