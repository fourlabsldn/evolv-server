/* globals PROPERTY_INFO*/
import assert from './_shared/assert.js';

assert(PROPERTY_INFO, 'No PROPERTY_INFO object provided.');

import ActiveHighlighter from './_shared/ActiveHighlighter';
import MapController from './search/_MapController.js';

const MAP_TARGET_SELECTOR = '.js-property-map';
const MAP_LABEL_SELECTOR = '.js-map-label';

// TODO: Add these meta properties so we have a nice thumbnail when sharing
// a link to the property.
// (function addMetaProperties() {
//   const mediaProperties = `
//   <meta property="og:url"           content="http://www.evolv.london" />
// 	<meta property="og:type"          content="website" />
// 	<meta property="og:title"         content="Evolv" />
// 	<meta property="og:description"   content="Luxury London Living" />
// 	<meta property="og:image"         content="/img/prop-img-4.jpg" />`;
//
//   document.head.innerHTML += mediaProperties;
// }());


(function controlPropertyTabs() {
  const tabsContainer = document.querySelector('.js-property-article-tab-labels');
  assert(tabsContainer && tabsContainer.nodeName, 'Tab labels not found.');

  const buttons = tabsContainer.children;
  const activeIndex = 0;
  const highlightOnClick = true;
  new ActiveHighlighter({ // eslint-disable-line no-new
    buttons,
    activeIndex,
    highlightOnClick,
  });
}());


(function controlButtons() {
  const printBtn = document.querySelector('.js-article-print');
  printBtn.addEventListener('click', () => window.print());

  // const mailBtn = document.querySelector('.js-article-mail');
  // mailBtn.addEventListener('click', () => window.print());
  //
  // const shareBtn = document.querySelector('.js-article-share');
  // shareBtn.addEventListener('click', () => window.print());
}());

(function showOnMap() {
  // Create map and instantiate a controller
  const mapController = new MapController(MAP_TARGET_SELECTOR);

  // Add a property marker to map
  mapController.createMarkersFromCoordinates([PROPERTY_INFO.address]);
  mapController.createCluster();

  // NOTE: Google maps has some problems being initialised hidden. Therefore
  // to make it show propperly we trigger an artificial resize event.
  // We need to set a delay to give preference for the css chage of the
  // display property in the execution queue before triggering the resize.
  const mapLabel = document.querySelector(MAP_LABEL_SELECTOR);

  mapLabel.addEventListener('click', () => {
    setTimeout(() => {
      mapController.triggerResize();
      mapController.centerOnMarkers();
    }, 50);
  });
}());
