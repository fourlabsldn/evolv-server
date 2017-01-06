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

function Highlight(el) {
	this.setActive(el);
}

Highlight.prototype.translateX = function (val) {
	assert(typeof val === 'number', 'translateX value is not a number');
	this.bar.style.transform = 'translate3d(' + val + 'px, 0, 0)';
};

Highlight.prototype.setWidth = function (val) {
	assert(typeof val === 'number', 'translateX value is not a number');
	this.bar.style.width = val + 'px';
};

Highlight.prototype.getBaseXPosition = function () {
	var parentBox = this.parent.getBoundingClientRect();
	return parentBox.left;
};

Highlight.prototype.returnToBasePosition = function () {
	this.translateX(0);
	var parentBox = this.parent.getBoundingClientRect();
	var parentWidth = parentBox.right - parentBox.left;
	this.setWidth(parentWidth);
};

Highlight.prototype.moveToElementPosition = function (el) {
	var basePos = this.getBaseXPosition();
	var elBox = el.getBoundingClientRect();
	var displacement = elBox.left - basePos;
	this.translateX(displacement);
	var elWidth = elBox.right - elBox.left;
	this.setWidth(elWidth);
};

Highlight.prototype.setActive = function (el) {
	if (this.bar) {
		this.bar.remove();
		this.bar = null;
	}

	assert(el && el.nodeName, 'Invalid element passed to setActive');
	this.parent = el;
	this.bar = document.createElement('div');
	this.bar.classList.add('active-highlight');
	this.parent.appendChild(this.bar);
};

function ActiveHighlighter() {
	var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	var buttons = _ref.buttons;
	var _ref$activeIndex = _ref.activeIndex;
	var activeIndex = _ref$activeIndex === undefined ? 0 : _ref$activeIndex;
	var _ref$highlightOnClick = _ref.highlightOnClick;
	var highlightOnClick = _ref$highlightOnClick === undefined ? false : _ref$highlightOnClick;

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
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
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

function hideAndShow() {
  var toggleNavbarBtn = document.querySelector('.js-navbar-toggle-button');
  var navbar = document.querySelector('.navbar');
  var showNavbarClass = 'show-navbar';
  var mousePosition = { x: 0, y: 0 };
  var isHomeScreen = window.PAGE_INFO !== undefined && window.PAGE_INFO.name === 'home';

  function isSmallScreen() {
    return window.innerWidth <= 768;
  }

  function showNavbar() {
    document.body.classList.add(showNavbarClass);
  }

  function hideNavbar() {
    document.body.classList.remove(showNavbarClass);
  }

  function registerMouseMove(e) {
    mousePosition.x = e.pageX;
    mousePosition.y = e.pageY;
  }

  function mouseOutOfNavbar() {
    var navbox = navbar.getBoundingClientRect();
    var tolerance = 100; // Amount out of navbar where it still shouldn't hide.
    var insideVertically = navbox.top < mousePosition.y && mousePosition.y < navbox.bottom + tolerance;
    var insideHorizontally = navbox.left < mousePosition.x && mousePosition.x < navbox.right;
    return !(insideVertically && insideHorizontally);
  }

  function checkIfShouldHideNavbar() {
    console.log('Checking');
    if (mouseOutOfNavbar()) {
      window.removeEventListener('mousemove', registerMouseMove);
      hideNavbar();
    } else {
      requestAnimationFrame(checkIfShouldHideNavbar);
    }
  }

  if (isHomeScreen) {
    toggleNavbarBtn.addEventListener('mouseenter', function () {
      if (!isSmallScreen()) {
        showNavbar();
      }
    });

    navbar.addEventListener('mouseleave', function (e) {
      if (!isSmallScreen()) {
        registerMouseMove(e);
        window.addEventListener('mousemove', registerMouseMove);
        checkIfShouldHideNavbar();
      }
    });
  }
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
  if (!navbarActiveButton && (typeof PAGE_INFO === 'undefined' ? 'undefined' : _typeof(PAGE_INFO)) === 'object' && typeof PAGE_INFO.name === 'string') {
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

var modalHiddenClass = 'modal--hidden';
var modalContentSelector = '.js-modal-content';
var closeBtnSelector = '.js-modal-closeBtn';

var ModalController = function () {
  function ModalController(modalEl, toggleButton) {
    var _this = this;

    classCallCheck(this, ModalController);

    assert(modalEl, 'No modal element provided');
    this.modalEl = modalEl;

    this.modalContent = modalEl.querySelector(modalContentSelector);
    assert(this.modalContent, 'No modal content element found.');

    this.closeBtn = modalEl.querySelector(closeBtnSelector);
    assert(this.modalContent, 'No close button found for modal.');
    this.closeBtn.addEventListener('click', function () {
      return _this.close();
    });

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

  createClass(ModalController, [{
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
      // Take care of bug in chrome that shows wrong info for option selection
      if (e.target.nodeName === 'SELECT') {
        return;
      }
      var contentRect = this.modalContent.getBoundingClientRect();

      var insideVertically = contentRect.top < e.clientY && e.clientY < contentRect.bottom;
      var insideHorizontally = contentRect.left < e.clientX && e.clientX < contentRect.right;

      return !(insideVertically && insideHorizontally);
    }
  }]);
  return ModalController;
}();

controlNavbar();

window.elevator = Elevator;

window.ModalController = ModalController;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjb21tb24uanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG5hdmJhckNvbnRyb2wgZnJvbSAnLi9fY29tbW9uL25hdmJhci5qcyc7XG5uYXZiYXJDb250cm9sKCk7XG5cbmltcG9ydCBlbGV2YXRvciBmcm9tICcuL19jb21tb24vZWxldmF0b3IuanMnO1xud2luZG93LmVsZXZhdG9yID0gZWxldmF0b3I7XG5cbmltcG9ydCBNb2RhbENvbnRyb2xsZXIgZnJvbSAnLi9fY29tbW9uL01vZGFsQ29udHJvbGxlci5qcyc7XG53aW5kb3cuTW9kYWxDb250cm9sbGVyID0gTW9kYWxDb250cm9sbGVyO1xuIl0sImZpbGUiOiJjb21tb24uanMifQ==
