import MakeArg from '../_shared/MakeArg';
import MapController from './_MapController.js';
import SearchController from './_SearchController.js';

// Global values
const SEARCH_BAR_SELECTOR = '.search-bar';
const MAP_TARGET_SELECTOR = '.js-property-map';
const TILES_LIST_CONTAINER_SELECTOR = '.js-property-list';
const SEARCH_INPUT_SELECTOR = '.js-search-input';
const SEARCH_INFO_SELECTOR = '.js-search-info';

/**
 * Display properties on the map
 * @function showOnMap
 * @param  {Array<Object>} coordinates Each item in the 'coordinate' array
 *                 must have a 'latitude', a 'longitude' and a 'url' property
 * @param  {Object} mapController
 * @return {void}
 */
function showOnMap(coordinates, mapController) {
  mapController.createMarkersFromCoordinates(coordinates);
  mapController.createCluster();
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
        if (!tile.dataset.longitude || !tile.dataset.latitude) {
          continue;
        }

        coordinates.push({
          url: tile.dataset.url,
          latitude: tile.dataset.latitude,
          longitude: tile.dataset.longitude
        });
      }

      showOnMap(coordinates, mapController);
    }
  };

  const searchController = new SearchController(searchControllerConfig);

  // Create map and instantiate a controller
  const mapContainer = document.querySelector(MAP_TARGET_SELECTOR);
  const mapController = new MapController(mapContainer);

  fillSearchFromQueryParameters(searchController, mapController);
}

initPage();
