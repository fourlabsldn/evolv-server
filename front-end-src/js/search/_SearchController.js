/* globals */
/* eslint-env browser */
import assert from '../_shared/assert.js';

// class-wide globals

// Search filters options containing a 'selected' attribute will be considered
// placeholder options and will receive this value;
const PLACEHOLDER_VALUE = '';
const HIDDEN_CLASS = 'hidden';
/**
 *
 * This class assumes that the filter elements never change but that
 * the search target elements may change.
 *
 * This class assumes that filters will have a property called criteria
 * which will have one or criterion names separated by a space character. Each
 * criterion must correspond to a dataset property of the target elements.
 *
 * The search will match a filter value with the value of the dataset property of
 * the target element specified by the filter's criteria attribute.
 *
 * 	@class SearchController
 */
export default class SearchController {

  /**
   * @constructor
   * @param  {String} searchBarSelector        [description]
   * @param  {String} searchFieldsSelector     [description]
   * @param  {String} targetsContainerSelector [description]
   * @param  {String} infoElSelector           [description]
   * @param  {Function} filtersAppliedcallback   to be called with 'matches'
   * 																						 and 'nonMatches' as parameters
   */
  constructor(config = {}) {
    const searchBarSelector = config.searchBarSelector;
    const searchFieldsSelector = config.searchFieldsSelector;
    const targetsContainerSelector = config.targetsContainerSelector;
    const infoElSelector = config.infoElSelector;
    const filtersAppliedcallback = config.filtersAppliedcallback;

    // Get search bar
    const searchBarEl = document.querySelector(searchBarSelector);
    assert(searchBarEl && searchBarEl.nodeName,
      `No search bar found using selectos '${searchBarSelector}'`);
    this.searchBarEl = searchBarEl;

    // Get search fields
    const filters = Array.from(searchBarEl.querySelectorAll(searchFieldsSelector));
    assert(filters && filters.length,
      `No search fields found with selector '${searchFieldsSelector}'`);
    // Let's reverse it so that in the search, the text input element is searched
    // last as it fits multiple criteria and shadows other elements in the
    // filter search.
    this.filters = filters.reverse();

    // Get search targets container. It contains the elements
    // that will be searched for.
    const targetsContainer = document.querySelector(targetsContainerSelector);
    assert(targetsContainer && targetsContainer.nodeName,
      `No valid search container found using selector ${targetsContainerSelector}.`);
    this.targetsContainer = targetsContainer;

    // Get info element. where we will show a message if anything goes wrong.
    const infoEl = document.querySelector(infoElSelector);
    assert(infoEl && infoEl.nodeName,
      `No valid info element found using selector ${infoElSelector}.`);
    this.infoEl = infoEl;

    if (typeof filtersAppliedcallback === 'function') {
      this.filtersAppliedcallback = filtersAppliedcallback;
    } else {
      this.filtersAppliedcallback = () => { return null; };
    }

    // Begin UI control
    handleUI(filters);

    // Prepare filters
    this._initFilterElements(filters);
  }

  // ===========================================================================
  //    FUNCTIONALITY CONTROLS
  // ===========================================================================

  _initFilterElements(filters = this.filters) {
    // Listen to changes to all filters so we can trigger a search
    for (const filter of filters) {
      const checkEvent = (filter.nodeName === 'SELECT') ? 'change' : 'keyup';
      filter.addEventListener(checkEvent, () => {
        this.applyFilters();
      });
    }
  }
  /**
   * @method applyFilters
   * @param  {Array[HTMLElement]} filters
   * @param  {HTMLElement} targetsContainer
   * @param  {HTMLElement} infoEl Element to show info about the search.
   * @return {Array[HTMLElement]} Array of elements that matched the search
   */
  applyFilters(
      filters = this.filters,
      targetsContainer = this.targetsContainer,
      infoEl = this.infoEl) {
    assert(filters, 'No filters provided.');
    assert(targetsContainer, 'No filter targets container provided');
    assert(infoEl, 'No info element provided');

    const targets = Array.from(targetsContainer.children);
    if (targets.length === 0) {
      console.warn('No target elements being filtered.');
    }

    let matches = [];
    let nonMatches = [];

    // run through all target elements
    for (const target of targets) {
      // Check whether it matches all filters
      const match = targetMatchesFilters(target, filters);

      // Show or hide it based on that
      const destination = match ? matches : nonMatches;
      destination.push(target);
    }

    if (matches.length === 0) {
      // If nothing was found, then let's show everything and show a
      // message explaining the outcome.
      infoEl.classList.remove(HIDDEN_CLASS);
      infoEl.innerText = 'No properties were found using these filters';

      matches = targets;
      nonMatches = [];
    } else {
      // If we had matches, then let's show them and hide all other stuff
      infoEl.classList.add(HIDDEN_CLASS);
    }

    matches.forEach((el) => { show(el, true); });
    nonMatches.forEach((el) => { show(el, false); });

    this.filtersAppliedcallback(matches, nonMatches);
    return matches;
  }
  // ------------------------END OF FUNCTIONALITY CONTROLS ----------------------

  /**
   *
   * Fills a field with a value or selects a dropdown option
   * that matches the value.
   * @method fillFieldByIndex
   * @param  {Int / HTMLElement} filterReference Can be the filter itself or the filter index
   * @param  {String} value
   * @param  {Array[HTMLElement]} filters
   * @return {void}
   */
  fillFilter(filterReference, value, filters = this.filters) {
    let filter;

    if (typeof filterReference === 'number') {
      // index was provided
      filter = filters[filterReference];
    } else {
      // The filter itself was provided.
      filter = filterReference;
    }

    assert(filter && filter.nodeName,
      `Invalid 'filterReference' provided: ${filter}`);
    assert(typeof value === 'string',
      `Invalid 'value' value: ${value}`);

    const isTypeableInput = filter.nodeName === 'INPUT' &&
      filter.getAttribute('type') &&
      (filter.getAttribute('type').toLowerCase() === 'search' ||
        filter.getAttribute('type').toLowerCase() === 'text');

    if (isTypeableInput) {
      filter.value = value;
    } else if (filter.nodeName === 'SELECT') {
      // Let's get the value of all the options in the select
      const optionElements = Array.from(filter.querySelectorAll('option'));
      const optionValues = optionElements.map((optionEl) => {
        // If it is set as selected is because it is a placeholder option.
        if (optionEl.selected) { return PLACEHOLDER_VALUE; }
        return optionEl.getAttribute('value') || optionEl.innerHTML;
      });

      const valueOptionIndex = optionValues.findIndex((optionValue) => {
        return searchMatch(value, optionValue);
      });

      if (valueOptionIndex > -1) {
        filter.selectedIndex = valueOptionIndex;
      } else {
        // The value was not found, so let's just do nothing.
        console.warn(`No option available for value '${value}'`);
      }
    }
  }

  getFilterByCriterion(criterion, filters = this.filters) {
    for (const filter of filters) {
      const filterCriteria = getFilterCriteria(filter);
      if (filterCriteria.indexOf(criterion) > -1) {
        return filter;
      }
    }

    return null;
  }
}

// ========================================================================
//  PRIVATE STUFF
// ========================================================================
/**
 * @method searchMatch
 * @param  {String} txt1
 * @param  {String} txt2
 * @return {Boolean}
 */
function searchMatch(txt1, txt2) {
  if (typeof txt1 !== 'string' || typeof txt2 !== 'string') {
    txt1 = txt1.toString();
    txt2 = txt2.toString();
  }

  txt1 = txt1.toLowerCase().trim();
  txt2 = txt2.toLowerCase().trim();

  if (txt1 === '' || txt2 === '') {
    return false;
  }

  const foundInsideTxt1 = txt1.indexOf(txt2) >= 0;
  const foundInsideTxt2 = txt2.indexOf(txt1) >= 0;
  return foundInsideTxt1 || foundInsideTxt2;
}

// Hides or shows an element
function show(el, showBool) {
  if (showBool) {
    el.style.display = 'block';
  } else {
    el.style.display = 'none';
  }
}

/**
 * @method getTargetProperty
 * @param  {HTMLElement} target
 * @param  {String} property
 * @return {String}
 */
function getTargetProperty(target, property) {
  return target.dataset[property];
}

/**
 * @method getFilterCriteria
 * @param  {HTMLElement} filter
 * @return {Array[string]}
 */
function getFilterCriteria(filter) {
  assert(filter, 'No filter provided.');
  const criteriaString = filter.dataset.criteria;
  if (typeof criteriaString !== 'string') {
    return [];
  }

  const criteria = criteriaString.split(' ');
  return criteria;
}

/**
 * @method targetMatchesFilters
 * @param  {HTMLElement} target - Property tile with data properties to be filtered
 * @param  {Array<HTMLElement>} filters - Array with the 'select' html elements
 * @return {Boolean}
 */
function targetMatchesFilters(target, filters) {
  let matched = true;

  // Check if it matches all filters
  for (const filter of filters) {
    const criteria = getFilterCriteria(filter);

    const value = filter.value;

    // Placeholder values do not make a match fail.
    if (value === PLACEHOLDER_VALUE) { continue; }

    let filterMatched = false;

    // Check against all criteria for the filter;
    for (const criterion of criteria) {
      const targetPropertyValue = getTargetProperty(target, criterion) || '';

      // This works buy is not a good piece of code. Refactor when there is
      // some time.
      // If it matches any criterion, then it matches the filter.
      if (criterion === 'price') {
        const targetPropertyValueInt = parseInt(targetPropertyValue, 10);
        const valueInt = parseInt(value, 10);
        const noNaNValue = !isNaN(targetPropertyValueInt) && !isNaN(valueInt);
        if (noNaNValue && targetPropertyValueInt < valueInt) {
          filterMatched = true;
          break;
        }
      } else if (searchMatch(value, targetPropertyValue)) {
        filterMatched = true;
        break;
      }
    }

    // If it doesn't match any one of the filters, then it is not a
    // search match.
    if (!filterMatched) {
      matched = false;
      break;
    }
  }

  return matched;
}

// ===========================================================================
//    UI CONTROLS
// ===========================================================================
/**
 * Controls the highlighting of selected filters
 * @method handleUI
 * @param  {Array[HTMLElement]} filters
 * @return {void}
 */
function handleUI(filters) {
  assert(filters && filters.length > 0,
    'No search filters provided.');

  function getButtonContainer(btn) {
    if (btn.nodeName && btn.nodeName === 'INPUT') {
      return btn.parentElement;
    }
    return btn;
  }

  // Highlight field on focus and leave it
  // highlighted if anything was changed in the options.
  for (const filter of filters) {
    filter.addEventListener('blur', () => {
      const filledInput = (filter.value && filter.value.trim().length > 0);
      const nonPlaceholderOptionSelected = (filter.selectedIndex && filter.selectedIndex > 0);

      if (!filledInput && !nonPlaceholderOptionSelected) {
        const container = getButtonContainer(filter);
        container.classList.remove('search-bar-btn-active');
      }
    });

    filter.addEventListener('focus', () => {
      const container = getButtonContainer(filter);
      container.classList.add('search-bar-btn-active');
    });
  }
}
// ------------------------END OF UI CONTROL ----------------------
