/* globals PAGE_INFO*/
/* eslint-env browser */

import assert from '../_shared/assert';
import ArrayHighlighter from '../_shared/ActiveHighlighter';

function hideAndShow() {
  const toggleNavbarBtn = document.querySelector('.js-navbar-toggle-button');
  const navbar = document.querySelector('.navbar');
  const showNavbarClass = 'show-navbar';
  const mousePosition = { x: 0, y: 0 };
  const isHomeScreen = window.PAGE_INFO !== undefined && window.PAGE_INFO.name === 'home';

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
    const navbox = navbar.getBoundingClientRect();
    const tolerance = 100; // Amount out of navbar where it still shouldn't hide.
    const insideVertically = navbox.top < mousePosition.y
                          && mousePosition.y < navbox.bottom + tolerance;
    const insideHorizontally = navbox.left < mousePosition.x
                          && mousePosition.x < navbox.right;
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
    toggleNavbarBtn.addEventListener('mouseenter', () => {
      if (!isSmallScreen()) {
        showNavbar();
      }
    });

    navbar.addEventListener('mouseleave', (e) => {
      if (!isSmallScreen()) {
        registerMouseMove(e);
        window.addEventListener('mousemove', registerMouseMove);
        checkIfShouldHideNavbar();
      }
    });
  }
}

function activeButton(pageNameParam) {
  let pageName;
  let navbarActiveButton;
  const buttonsContainer = document.querySelector('.navigation-buttons');

  // First we try and get the page name from a parameter
  if (pageNameParam) {
    pageName = pageNameParam;
    pageName = CSS.escape(pageName);
    navbarActiveButton = buttonsContainer.querySelector(`[name=${pageName}]`);
  }

  // If it wasn't successfull we try to get it from a global object
  if (!navbarActiveButton && typeof PAGE_INFO === 'object' && typeof PAGE_INFO.name === 'string') {
    pageName = PAGE_INFO.name;
    pageName = CSS.escape(pageName);
    navbarActiveButton = buttonsContainer.querySelector(`[name=${pageName}]`);
  // Then we just say it is home.
  }

  // If we still don't have it let's try to guess from the url.
  if (!navbarActiveButton) {
    const pathname = location.pathname;
    const pageNameRegex = /\/([^\.]+)(?:\..*)?$/;
    const pageNameMatch = pathname.match(pageNameRegex) || [];
    pageName = pageNameMatch[1];
    pageName = CSS.escape(pageName);
    navbarActiveButton = buttonsContainer.querySelector(`[name=${pageName}]`);
  }

  // If we still didn't get anything, let's not activate the highlighter.
  if (!navbarActiveButton) {
    return;
  }
  assert(navbarActiveButton, 'Error finding navbar\'s active button.');

  // Get all navigation buttons
  let navbarButtons = buttonsContainer.querySelectorAll('li');
  assert((navbarButtons && navbarButtons.length > 0), 'No navigation buttons found');
  navbarButtons = Array.from(navbarButtons);

  // Remove items with navigation buttons from navbarButton array
  for (const item of navbarButtons) {
    if (item.querySelector('.navbar-button')) {
      const itemIndex = navbarButtons.indexOf(item);
      navbarButtons.splice(itemIndex, 1);
    }
  }

  // Handle highlight in these buttons
  new ArrayHighlighter({ // eslint-disable-line no-new
    buttons: navbarButtons,
    activeIndex: navbarButtons.indexOf(navbarActiveButton),
    highlightOnClick: true,
  });
}

// Assigns an event listener to searchBar;
function initSearchBarToggle() {
  const searchButtonSelector = '.website-search';
  const searchButton = document.querySelector(searchButtonSelector);
  assert(searchButton && searchButton.nodeName, 'No search button found.');

  const navbarContainerSelector = '.navbar-container';
  const navbarContainer = document.querySelector(navbarContainerSelector);
  assert(navbarContainer && navbarContainer.nodeName, 'No navbar container found.');

  const navbarDropdownSelector = '.navbar-dropdown-search';
  const navbarDropdown = document.querySelector(navbarDropdownSelector);
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
    const dropdownBox = navbarDropdown.getBoundingClientRect();
    const clickWidthinX = e.clientX < dropdownBox.right && e.clientX > dropdownBox.left;
    const clickWidthinY = e.clientY < dropdownBox.bottom && e.clientY > dropdownBox.top;
    if (!clickWidthinY || !clickWidthinX) {
      hideSearchBar();
    }
  }

  const searchBarOpenClass = 'dropdown-search-open';
  searchButton.addEventListener('click', (e) => {
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
  const searchFormSelector = '.js-navbar-dropdown-search';
  const searchForm = document.querySelector(searchFormSelector);
  assert(searchForm && searchForm.nodeName, 'No search form found.');

  const rentBtnSelector = '.js-navbar-dropdow-search-rent-btn';
  const rentBtnTarget = '/rent';
  const rentBtn = document.querySelector(rentBtnSelector);
  assert(rentBtn && rentBtn.nodeName, 'No rent button found.');

  rentBtn.addEventListener('click', () => {
    searchForm.action = rentBtnTarget;
    searchForm.submit();
  });
}


export default function controlNavbar(pageName) {
  hideAndShow();
  activeButton(pageName);
  initSearchBarToggle();
  initSearchBarButtons();
}
