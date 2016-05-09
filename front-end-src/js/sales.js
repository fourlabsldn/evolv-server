/* globals MakeArg*/
import assert from './_shared/assert.js';

import MapController from './_sales/MapController.js';
import SearchController from './_sales/SearchController.js';

// Global values
const SEARCH_BAR_SELECTOR = '.search-bar';
const MAP_TARGET_SELECTOR = '.js-property-map';
const TILES_LIST_CONTAINER_SELECTOR = '.js-property-list';
const SEARCH_INPUT_SELECTOR = '.js-search-input';
const SEARCH_INFO_SELECTOR = '.js-search-info';

function loadProperties() {
  'use strict';

  return fetch('/js/database.json')
    .then((jsonText) => jsonText.json())
    .then((database) => {
      assert(Array.isArray(database.properties),
        'Invalid database file loaded. No properties array found.');
      return database;
    });
}

/**
 * Creates an HTML element for a property's Object.
 * (Real estate property, not a Javascript construct)
 * @function createTileElement
 * @param  {objects} prop Object with the property's details
 * @return {HTMLElement}      The property element ready to go to the DOM.
 */
function createTileElement(prop) {
  prop.address = prop.address || {};
  const propHtml = `<div class="prop-tile">
      <div class="prop-tile-crop">
        <a href="/property.html?id=${prop.id}">
          <img src="${prop.images[0]}"
          alt="${prop.address.houseNumber} ${prop.address.street}" />
        </a>
      </div>
      <div class="prop-tile-description">
        <h2 class="prop-tile-title-and-address">
          <a href="/property.html">
            <span class="prop-tile-street-name">
              ${prop.address.street}
            </span>
            <span class="prop-tile-postcode">
              ${prop.address.city} ${prop.address.postcode}
            </span>
          </a>
        </h2>

        <p class="prop-tile-buy-info">
          <span class="prop-tile-price">${prop.price}</span>
          <span class="prop-tile-ownership">${prop.ownership}</span>
        </p>
      </div>
    </div>`;

  const div = document.createElement('div');
  div.innerHTML = propHtml;

  const propElement = div.children[0];

  // Add data- info
  propElement.dataset.price = prop.price;
  propElement.dataset.postcode = prop.address.postcode;
  propElement.dataset.street = prop.address.street;
  propElement.dataset.bedrooms = prop.bedrooms;
  propElement.dataset.details = prop['details-list'].join(' ');
  propElement.dataset.ownership = prop.ownership;
  propElement.dataset.fullAddress = prop.location;
  propElement.dataset.sellRent = prop.sellRent;
  propElement.dataset.latitude = prop.address.latitude;
  propElement.dataset.longitude = prop.address.longitude;

  return propElement;
}

/**
 * Display properties on the map
 * @function showOnMap
 * @param  {Array} coordinates Each item in the 'coordinate' array
 *                 must have a 'latitude' and a 'longitude' property
 * @param  {Object} mapController
 * @return {void}
 */
function showOnMap(coordinates, mapController) {
  mapController.createMarkersFromCoordinates(coordinates);
  mapController.createCluster();
}


function createTiles(properties, targetSelector) {
  'use strict';

  const propListContainer = document.querySelector(targetSelector);
  assert(propListContainer, 'No property list container element found in the DOM.');

  // Add properties nicely formatted to the DOM.
  for (const prop of properties) {
    const propEl = createTileElement(prop);
    propListContainer.appendChild(propEl);
  }
}

function fillSearchFromQueryParameters(searchController) {
  const Arg = MakeArg(); // eslint-disable-line new-cap
  const getParameters = Arg.all();
  const getParametersKeys = Object.keys(getParameters);

  for (const par of getParametersKeys) {
    const filter = searchController.getFilterByCriterion(par);
    if (filter) {
      let value = getParameters[par];
      value = (typeof value === 'string') ? value : value.toString();
      searchController.fillFilter(filter, value);
    }
  }


  // Now we apply the filter.
  searchController.applyFilters();
}

function initPage() {
  // Start control of search bar
  const searchControllerConfig = {
    searchBarSelector: SEARCH_BAR_SELECTOR,
    searchFieldsSelector: SEARCH_INPUT_SELECTOR,
    targetsContainerSelector: TILES_LIST_CONTAINER_SELECTOR,
    infoElSelector: SEARCH_INFO_SELECTOR,
    // filter applied callback
    filtersAppliedcallback: (matches) => {
      const coordinates = [];
      for (const tile of matches) {
        coordinates.push({
          latitude: tile.dataset.latitude,
          longitude: tile.dataset.longitude,
        });
      }

      showOnMap(coordinates, mapController);
    },
  };

  const searchController = new SearchController(searchControllerConfig);

  // Create map and instantiate a controller
  const mapController = new MapController(MAP_TARGET_SELECTOR);

  // Get stuff from the server
  loadProperties()
    .then((database) => {
      const properties = database.properties;
      // Display server data in appropriate places
      createTiles(properties, TILES_LIST_CONTAINER_SELECTOR);

      // Now we fill the search from what is in the URL and perform a search.
      fillSearchFromQueryParameters(searchController, mapController);
    })
    .catch((err) => {
      throw new Error(err);
    });
}

initPage();
