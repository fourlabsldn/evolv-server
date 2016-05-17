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

// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @externs_url http://closure-compiler.googlecode.com/svn/trunk/contrib/externs/maps/google_maps_api_v3_3.js
// ==/ClosureCompiler==

/**
 * @name MarkerClusterer for Google Maps v3
 * @version version 1.0.1
 * @author Luke Mahe
 * @fileoverview
 * The library creates and manages per-zoom-level clusters for large amounts of
 * markers.
 * <br/>
 * This is a v3 implementation of the
 * <a href="http://gmaps-utility-library-dev.googlecode.com/svn/tags/markerclusterer/"
 * >v2 MarkerClusterer</a>.
 */

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * A Marker Clusterer that clusters markers.
 *
 * @param {google.maps.Map} map The Google map to attach to.
 * @param {Array.<google.maps.Marker>=} opt_markers Optional markers to add to
 *   the cluster.
 * @param {Object=} opt_options support the following options:
 *     'gridSize': (number) The grid size of a cluster in pixels.
 *     'maxZoom': (number) The maximum zoom level that a marker can be part of a
 *                cluster.
 *     'zoomOnClick': (boolean) Whether the default behaviour of clicking on a
 *                    cluster is to zoom into it.
 *     'averageCenter': (boolean) Wether the center of each cluster should be
 *                      the average of all markers in the cluster.
 *     'minimumClusterSize': (number) The minimum number of markers to be in a
 *                           cluster before the markers are hidden and a count
 *                           is shown.
 *     'styles': (object) An object that has style properties:
 *       'url': (string) The image url.
 *       'height': (number) The image height.
 *       'width': (number) The image width.
 *       'anchor': (Array) The anchor position of the label text.
 *       'textColor': (string) The text color.
 *       'textSize': (number) The text size.
 *       'backgroundPosition': (string) The position of the backgound x, y.
 * @constructor
 * @extends google.maps.OverlayView
 */
function MarkerClusterer(map, opt_markers, opt_options) {
  // MarkerClusterer implements google.maps.OverlayView interface. We use the
  // extend function to extend MarkerClusterer with google.maps.OverlayView
  // because it might not always be available when the code is defined so we
  // look for it at the last possible moment. If it doesn't exist now then
  // there is no point going ahead :)
  this.extend(MarkerClusterer, google.maps.OverlayView);
  this.map_ = map;

  /**
   * @type {Array.<google.maps.Marker>}
   * @private
   */
  this.markers_ = [];

  /**
   *  @type {Array.<Cluster>}
   */
  this.clusters_ = [];

  this.sizes = [53, 56, 66, 78, 90];

  /**
   * @private
   */
  this.styles_ = [];

  /**
   * @type {boolean}
   * @private
   */
  this.ready_ = false;

  var options = opt_options || {};

  /**
   * @type {number}
   * @private
   */
  this.gridSize_ = options['gridSize'] || 60;

  /**
   * @private
   */
  this.minClusterSize_ = options['minimumClusterSize'] || 2;

  /**
   * @type {?number}
   * @private
   */
  this.maxZoom_ = options['maxZoom'] || null;

  this.styles_ = options['styles'] || [];

  /**
   * @type {string}
   * @private
   */
  this.imagePath_ = options['imagePath'] || this.MARKER_CLUSTER_IMAGE_PATH_;

  /**
   * @type {string}
   * @private
   */
  this.imageExtension_ = options['imageExtension'] || this.MARKER_CLUSTER_IMAGE_EXTENSION_;

  /**
   * @type {boolean}
   * @private
   */
  this.zoomOnClick_ = true;

  if (options['zoomOnClick'] != undefined) {
    this.zoomOnClick_ = options['zoomOnClick'];
  }

  /**
   * @type {boolean}
   * @private
   */
  this.averageCenter_ = false;

  if (options['averageCenter'] != undefined) {
    this.averageCenter_ = options['averageCenter'];
  }

  this.setupStyles_();

  this.setMap(map);

  /**
   * @type {number}
   * @private
   */
  this.prevZoom_ = this.map_.getZoom();

  // Add the map event listeners
  var that = this;
  google.maps.event.addListener(this.map_, 'zoom_changed', function () {
    // Determines map type and prevent illegal zoom levels
    var zoom = that.map_.getZoom();
    var minZoom = that.map_.minZoom || 0;
    var maxZoom = Math.min(that.map_.maxZoom || 100, that.map_.mapTypes[that.map_.getMapTypeId()].maxZoom);
    zoom = Math.min(Math.max(zoom, minZoom), maxZoom);

    if (that.prevZoom_ != zoom) {
      that.prevZoom_ = zoom;
      that.resetViewport();
    }
  });

  google.maps.event.addListener(this.map_, 'idle', function () {
    that.redraw();
  });

  // Finally, add the markers
  if (opt_markers && (opt_markers.length || Object.keys(opt_markers).length)) {
    this.addMarkers(opt_markers, false);
  }
}

/**
 * The marker cluster image path.
 *
 * @type {string}
 * @private
 */
MarkerClusterer.prototype.MARKER_CLUSTER_IMAGE_PATH_ = 'http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/' + 'images/m';

/**
 * The marker cluster image path.
 *
 * @type {string}
 * @private
 */
MarkerClusterer.prototype.MARKER_CLUSTER_IMAGE_EXTENSION_ = 'png';

/**
 * Extends a objects prototype by anothers.
 *
 * @param {Object} obj1 The object to be extended.
 * @param {Object} obj2 The object to extend with.
 * @return {Object} The new extended object.
 * @ignore
 */
MarkerClusterer.prototype.extend = function (obj1, obj2) {
  return function (object) {
    for (var property in object.prototype) {
      this.prototype[property] = object.prototype[property];
    }
    return this;
  }.apply(obj1, [obj2]);
};

/**
 * Implementaion of the interface method.
 * @ignore
 */
MarkerClusterer.prototype.onAdd = function () {
  this.setReady_(true);
};

/**
 * Implementaion of the interface method.
 * @ignore
 */
MarkerClusterer.prototype.draw = function () {};

/**
 * Sets up the styles object.
 *
 * @private
 */
MarkerClusterer.prototype.setupStyles_ = function () {
  if (this.styles_.length) {
    return;
  }

  for (var i = 0, size; size = this.sizes[i]; i++) {
    this.styles_.push({
      url: this.imagePath_ + (i + 1) + '.' + this.imageExtension_,
      height: size,
      width: size
    });
  }
};

/**
 *  Fit the map to the bounds of the markers in the clusterer.
 */
MarkerClusterer.prototype.fitMapToMarkers = function () {
  var markers = this.getMarkers();
  var bounds = new google.maps.LatLngBounds();
  for (var i = 0, marker; marker = markers[i]; i++) {
    bounds.extend(marker.getPosition());
  }

  this.map_.fitBounds(bounds);
};

/**
 *  Sets the styles.
 *
 *  @param {Object} styles The style to set.
 */
MarkerClusterer.prototype.setStyles = function (styles) {
  this.styles_ = styles;
};

/**
 *  Gets the styles.
 *
 *  @return {Object} The styles object.
 */
MarkerClusterer.prototype.getStyles = function () {
  return this.styles_;
};

/**
 * Whether zoom on click is set.
 *
 * @return {boolean} True if zoomOnClick_ is set.
 */
MarkerClusterer.prototype.isZoomOnClick = function () {
  return this.zoomOnClick_;
};

/**
 * Whether average center is set.
 *
 * @return {boolean} True if averageCenter_ is set.
 */
MarkerClusterer.prototype.isAverageCenter = function () {
  return this.averageCenter_;
};

/**
 *  Returns the array of markers in the clusterer.
 *
 *  @return {Array.<google.maps.Marker>} The markers.
 */
MarkerClusterer.prototype.getMarkers = function () {
  return this.markers_;
};

/**
 *  Returns the number of markers in the clusterer
 *
 *  @return {Number} The number of markers.
 */
MarkerClusterer.prototype.getTotalMarkers = function () {
  return this.markers_.length;
};

/**
 *  Sets the max zoom for the clusterer.
 *
 *  @param {number} maxZoom The max zoom level.
 */
MarkerClusterer.prototype.setMaxZoom = function (maxZoom) {
  this.maxZoom_ = maxZoom;
};

/**
 *  Gets the max zoom for the clusterer.
 *
 *  @return {number} The max zoom level.
 */
MarkerClusterer.prototype.getMaxZoom = function () {
  return this.maxZoom_;
};

/**
 *  The function for calculating the cluster icon image.
 *
 *  @param {Array.<google.maps.Marker>} markers The markers in the clusterer.
 *  @param {number} numStyles The number of styles available.
 *  @return {Object} A object properties: 'text' (string) and 'index' (number).
 *  @private
 */
MarkerClusterer.prototype.calculator_ = function (markers, numStyles) {
  var index = 0;
  var count = markers.length;
  var dv = count;
  while (dv !== 0) {
    dv = parseInt(dv / 10, 10);
    index++;
  }

  index = Math.min(index, numStyles);
  return {
    text: count,
    index: index
  };
};

/**
 * Set the calculator function.
 *
 * @param {function(Array, number)} calculator The function to set as the
 *     calculator. The function should return a object properties:
 *     'text' (string) and 'index' (number).
 *
 */
MarkerClusterer.prototype.setCalculator = function (calculator) {
  this.calculator_ = calculator;
};

/**
 * Get the calculator function.
 *
 * @return {function(Array, number)} the calculator function.
 */
MarkerClusterer.prototype.getCalculator = function () {
  return this.calculator_;
};

/**
 * Add an array of markers to the clusterer.
 *
 * @param {Array.<google.maps.Marker>} markers The markers to add.
 * @param {boolean=} opt_nodraw Whether to redraw the clusters.
 */
MarkerClusterer.prototype.addMarkers = function (markers, opt_nodraw) {
  if (markers.length) {
    for (var i = 0, marker; marker = markers[i]; i++) {
      this.pushMarkerTo_(marker);
    }
  } else if (Object.keys(markers).length) {
    for (var marker in markers) {
      this.pushMarkerTo_(markers[marker]);
    }
  }
  if (!opt_nodraw) {
    this.redraw();
  }
};

/**
 * Pushes a marker to the clusterer.
 *
 * @param {google.maps.Marker} marker The marker to add.
 * @private
 */
MarkerClusterer.prototype.pushMarkerTo_ = function (marker) {
  marker.isAdded = false;
  if (marker['draggable']) {
    // If the marker is draggable add a listener so we update the clusters on
    // the drag end.
    var that = this;
    google.maps.event.addListener(marker, 'dragend', function () {
      marker.isAdded = false;
      that.repaint();
    });
  }
  this.markers_.push(marker);
};

/**
 * Adds a marker to the clusterer and redraws if needed.
 *
 * @param {google.maps.Marker} marker The marker to add.
 * @param {boolean=} opt_nodraw Whether to redraw the clusters.
 */
MarkerClusterer.prototype.addMarker = function (marker, opt_nodraw) {
  this.pushMarkerTo_(marker);
  if (!opt_nodraw) {
    this.redraw();
  }
};

/**
 * Removes a marker and returns true if removed, false if not
 *
 * @param {google.maps.Marker} marker The marker to remove
 * @return {boolean} Whether the marker was removed or not
 * @private
 */
MarkerClusterer.prototype.removeMarker_ = function (marker) {
  var index = -1;
  if (this.markers_.indexOf) {
    index = this.markers_.indexOf(marker);
  } else {
    for (var i = 0, m; m = this.markers_[i]; i++) {
      if (m == marker) {
        index = i;
        break;
      }
    }
  }

  if (index == -1) {
    // Marker is not in our list of markers.
    return false;
  }

  marker.setMap(null);

  this.markers_.splice(index, 1);

  return true;
};

/**
 * Remove a marker from the cluster.
 *
 * @param {google.maps.Marker} marker The marker to remove.
 * @param {boolean=} opt_nodraw Optional boolean to force no redraw.
 * @return {boolean} True if the marker was removed.
 */
MarkerClusterer.prototype.removeMarker = function (marker, opt_nodraw) {
  var removed = this.removeMarker_(marker);

  if (!opt_nodraw && removed) {
    this.resetViewport();
    this.redraw();
    return true;
  } else {
    return false;
  }
};

/**
 * Removes an array of markers from the cluster.
 *
 * @param {Array.<google.maps.Marker>} markers The markers to remove.
 * @param {boolean=} opt_nodraw Optional boolean to force no redraw.
 */
MarkerClusterer.prototype.removeMarkers = function (markers, opt_nodraw) {
  var removed = false;

  for (var i = 0, marker; marker = markers[i]; i++) {
    var r = this.removeMarker_(marker);
    removed = removed || r;
  }

  if (!opt_nodraw && removed) {
    this.resetViewport();
    this.redraw();
    return true;
  }
};

/**
 * Sets the clusterer's ready state.
 *
 * @param {boolean} ready The state.
 * @private
 */
MarkerClusterer.prototype.setReady_ = function (ready) {
  if (!this.ready_) {
    this.ready_ = ready;
    this.createClusters_();
  }
};

/**
 * Returns the number of clusters in the clusterer.
 *
 * @return {number} The number of clusters.
 */
MarkerClusterer.prototype.getTotalClusters = function () {
  return this.clusters_.length;
};

/**
 * Returns the google map that the clusterer is associated with.
 *
 * @return {google.maps.Map} The map.
 */
MarkerClusterer.prototype.getMap = function () {
  return this.map_;
};

/**
 * Sets the google map that the clusterer is associated with.
 *
 * @param {google.maps.Map} map The map.
 */
MarkerClusterer.prototype.setMap = function (map) {
  this.map_ = map;
};

/**
 * Returns the size of the grid.
 *
 * @return {number} The grid size.
 */
MarkerClusterer.prototype.getGridSize = function () {
  return this.gridSize_;
};

/**
 * Sets the size of the grid.
 *
 * @param {number} size The grid size.
 */
MarkerClusterer.prototype.setGridSize = function (size) {
  this.gridSize_ = size;
};

/**
 * Returns the min cluster size.
 *
 * @return {number} The grid size.
 */
MarkerClusterer.prototype.getMinClusterSize = function () {
  return this.minClusterSize_;
};

/**
 * Sets the min cluster size.
 *
 * @param {number} size The grid size.
 */
MarkerClusterer.prototype.setMinClusterSize = function (size) {
  this.minClusterSize_ = size;
};

/**
 * Extends a bounds object by the grid size.
 *
 * @param {google.maps.LatLngBounds} bounds The bounds to extend.
 * @return {google.maps.LatLngBounds} The extended bounds.
 */
MarkerClusterer.prototype.getExtendedBounds = function (bounds) {
  var projection = this.getProjection();

  // Turn the bounds into latlng.
  var tr = new google.maps.LatLng(bounds.getNorthEast().lat(), bounds.getNorthEast().lng());
  var bl = new google.maps.LatLng(bounds.getSouthWest().lat(), bounds.getSouthWest().lng());

  // Convert the points to pixels and the extend out by the grid size.
  var trPix = projection.fromLatLngToDivPixel(tr);
  trPix.x += this.gridSize_;
  trPix.y -= this.gridSize_;

  var blPix = projection.fromLatLngToDivPixel(bl);
  blPix.x -= this.gridSize_;
  blPix.y += this.gridSize_;

  // Convert the pixel points back to LatLng
  var ne = projection.fromDivPixelToLatLng(trPix);
  var sw = projection.fromDivPixelToLatLng(blPix);

  // Extend the bounds to contain the new bounds.
  bounds.extend(ne);
  bounds.extend(sw);

  return bounds;
};

/**
 * Determins if a marker is contained in a bounds.
 *
 * @param {google.maps.Marker} marker The marker to check.
 * @param {google.maps.LatLngBounds} bounds The bounds to check against.
 * @return {boolean} True if the marker is in the bounds.
 * @private
 */
MarkerClusterer.prototype.isMarkerInBounds_ = function (marker, bounds) {
  return bounds.contains(marker.getPosition());
};

/**
 * Clears all clusters and markers from the clusterer.
 */
MarkerClusterer.prototype.clearMarkers = function () {
  this.resetViewport(true);

  // Set the markers a empty array.
  this.markers_ = [];
};

/**
 * Clears all existing clusters and recreates them.
 * @param {boolean} opt_hide To also hide the marker.
 */
MarkerClusterer.prototype.resetViewport = function (opt_hide) {
  // Remove all the clusters
  for (var i = 0, cluster; cluster = this.clusters_[i]; i++) {
    cluster.remove();
  }

  // Reset the markers to not be added and to be invisible.
  for (var i = 0, marker; marker = this.markers_[i]; i++) {
    marker.isAdded = false;
    if (opt_hide) {
      marker.setMap(null);
    }
  }

  this.clusters_ = [];
};

/**
 *
 */
MarkerClusterer.prototype.repaint = function () {
  var oldClusters = this.clusters_.slice();
  this.clusters_.length = 0;
  this.resetViewport();
  this.redraw();

  // Remove the old clusters.
  // Do it in a timeout so the other clusters have been drawn first.
  window.setTimeout(function () {
    for (var i = 0, cluster; cluster = oldClusters[i]; i++) {
      cluster.remove();
    }
  }, 0);
};

/**
 * Redraws the clusters.
 */
MarkerClusterer.prototype.redraw = function () {
  this.createClusters_();
};

/**
 * Calculates the distance between two latlng locations in km.
 * @see http://www.movable-type.co.uk/scripts/latlong.html
 *
 * @param {google.maps.LatLng} p1 The first lat lng point.
 * @param {google.maps.LatLng} p2 The second lat lng point.
 * @return {number} The distance between the two points in km.
 * @private
*/
MarkerClusterer.prototype.distanceBetweenPoints_ = function (p1, p2) {
  if (!p1 || !p2) {
    return 0;
  }

  var R = 6371; // Radius of the Earth in km
  var dLat = (p2.lat() - p1.lat()) * Math.PI / 180;
  var dLon = (p2.lng() - p1.lng()) * Math.PI / 180;
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(p1.lat() * Math.PI / 180) * Math.cos(p2.lat() * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
};

/**
 * Add a marker to a cluster, or creates a new cluster.
 *
 * @param {google.maps.Marker} marker The marker to add.
 * @private
 */
MarkerClusterer.prototype.addToClosestCluster_ = function (marker) {
  var distance = 40000; // Some large number
  var clusterToAddTo = null;
  var pos = marker.getPosition();
  for (var i = 0, cluster; cluster = this.clusters_[i]; i++) {
    var center = cluster.getCenter();
    if (center) {
      var d = this.distanceBetweenPoints_(center, marker.getPosition());
      if (d < distance) {
        distance = d;
        clusterToAddTo = cluster;
      }
    }
  }

  if (clusterToAddTo && clusterToAddTo.isMarkerInClusterBounds(marker)) {
    clusterToAddTo.addMarker(marker);
  } else {
    var cluster = new Cluster(this);
    cluster.addMarker(marker);
    this.clusters_.push(cluster);
  }
};

/**
 * Creates the clusters.
 *
 * @private
 */
MarkerClusterer.prototype.createClusters_ = function () {
  if (!this.ready_) {
    return;
  }

  // Get our current map view bounds.
  // Create a new bounds object so we don't affect the map.
  var mapBounds = new google.maps.LatLngBounds(this.map_.getBounds().getSouthWest(), this.map_.getBounds().getNorthEast());
  var bounds = this.getExtendedBounds(mapBounds);

  for (var i = 0, marker; marker = this.markers_[i]; i++) {
    if (!marker.isAdded && this.isMarkerInBounds_(marker, bounds)) {
      this.addToClosestCluster_(marker);
    }
  }
};

/**
 * A cluster that contains markers.
 *
 * @param {MarkerClusterer} markerClusterer The markerclusterer that this
 *     cluster is associated with.
 * @constructor
 * @ignore
 */
function Cluster(markerClusterer) {
  this.markerClusterer_ = markerClusterer;
  this.map_ = markerClusterer.getMap();
  this.gridSize_ = markerClusterer.getGridSize();
  this.minClusterSize_ = markerClusterer.getMinClusterSize();
  this.averageCenter_ = markerClusterer.isAverageCenter();
  this.center_ = null;
  this.markers_ = [];
  this.bounds_ = null;
  this.clusterIcon_ = new ClusterIcon(this, markerClusterer.getStyles(), markerClusterer.getGridSize());
}

/**
 * Determins if a marker is already added to the cluster.
 *
 * @param {google.maps.Marker} marker The marker to check.
 * @return {boolean} True if the marker is already added.
 */
Cluster.prototype.isMarkerAlreadyAdded = function (marker) {
  if (this.markers_.indexOf) {
    return this.markers_.indexOf(marker) != -1;
  } else {
    for (var i = 0, m; m = this.markers_[i]; i++) {
      if (m == marker) {
        return true;
      }
    }
  }
  return false;
};

/**
 * Add a marker the cluster.
 *
 * @param {google.maps.Marker} marker The marker to add.
 * @return {boolean} True if the marker was added.
 */
Cluster.prototype.addMarker = function (marker) {
  if (this.isMarkerAlreadyAdded(marker)) {
    return false;
  }

  if (!this.center_) {
    this.center_ = marker.getPosition();
    this.calculateBounds_();
  } else {
    if (this.averageCenter_) {
      var l = this.markers_.length + 1;
      var lat = (this.center_.lat() * (l - 1) + marker.getPosition().lat()) / l;
      var lng = (this.center_.lng() * (l - 1) + marker.getPosition().lng()) / l;
      this.center_ = new google.maps.LatLng(lat, lng);
      this.calculateBounds_();
    }
  }

  marker.isAdded = true;
  this.markers_.push(marker);

  var len = this.markers_.length;
  if (len < this.minClusterSize_ && marker.getMap() != this.map_) {
    // Min cluster size not reached so show the marker.
    marker.setMap(this.map_);
  }

  if (len == this.minClusterSize_) {
    // Hide the markers that were showing.
    for (var i = 0; i < len; i++) {
      this.markers_[i].setMap(null);
    }
  }

  if (len >= this.minClusterSize_) {
    marker.setMap(null);
  }

  this.updateIcon();
  return true;
};

/**
 * Returns the marker clusterer that the cluster is associated with.
 *
 * @return {MarkerClusterer} The associated marker clusterer.
 */
Cluster.prototype.getMarkerClusterer = function () {
  return this.markerClusterer_;
};

/**
 * Returns the bounds of the cluster.
 *
 * @return {google.maps.LatLngBounds} the cluster bounds.
 */
Cluster.prototype.getBounds = function () {
  var bounds = new google.maps.LatLngBounds(this.center_, this.center_);
  var markers = this.getMarkers();
  for (var i = 0, marker; marker = markers[i]; i++) {
    bounds.extend(marker.getPosition());
  }
  return bounds;
};

/**
 * Removes the cluster
 */
Cluster.prototype.remove = function () {
  this.clusterIcon_.remove();
  this.markers_.length = 0;
  delete this.markers_;
};

/**
 * Returns the center of the cluster.
 *
 * @return {number} The cluster center.
 */
Cluster.prototype.getSize = function () {
  return this.markers_.length;
};

/**
 * Returns the center of the cluster.
 *
 * @return {Array.<google.maps.Marker>} The cluster center.
 */
Cluster.prototype.getMarkers = function () {
  return this.markers_;
};

/**
 * Returns the center of the cluster.
 *
 * @return {google.maps.LatLng} The cluster center.
 */
Cluster.prototype.getCenter = function () {
  return this.center_;
};

/**
 * Calculated the extended bounds of the cluster with the grid.
 *
 * @private
 */
Cluster.prototype.calculateBounds_ = function () {
  var bounds = new google.maps.LatLngBounds(this.center_, this.center_);
  this.bounds_ = this.markerClusterer_.getExtendedBounds(bounds);
};

/**
 * Determines if a marker lies in the clusters bounds.
 *
 * @param {google.maps.Marker} marker The marker to check.
 * @return {boolean} True if the marker lies in the bounds.
 */
Cluster.prototype.isMarkerInClusterBounds = function (marker) {
  return this.bounds_.contains(marker.getPosition());
};

/**
 * Returns the map that the cluster is associated with.
 *
 * @return {google.maps.Map} The map.
 */
Cluster.prototype.getMap = function () {
  return this.map_;
};

/**
 * Updates the cluster icon
 */
Cluster.prototype.updateIcon = function () {
  var zoom = this.map_.getZoom();
  var mz = this.markerClusterer_.getMaxZoom();

  if (mz && zoom > mz) {
    // The zoom is greater than our max zoom so show all the markers in cluster.
    for (var i = 0, marker; marker = this.markers_[i]; i++) {
      marker.setMap(this.map_);
    }
    return;
  }

  if (this.markers_.length < this.minClusterSize_) {
    // Min cluster size not yet reached.
    this.clusterIcon_.hide();
    return;
  }

  var numStyles = this.markerClusterer_.getStyles().length;
  var sums = this.markerClusterer_.getCalculator()(this.markers_, numStyles);
  this.clusterIcon_.setCenter(this.center_);
  this.clusterIcon_.setSums(sums);
  this.clusterIcon_.show();
};

/**
 * A cluster icon
 *
 * @param {Cluster} cluster The cluster to be associated with.
 * @param {Object} styles An object that has style properties:
 *     'url': (string) The image url.
 *     'height': (number) The image height.
 *     'width': (number) The image width.
 *     'anchor': (Array) The anchor position of the label text.
 *     'textColor': (string) The text color.
 *     'textSize': (number) The text size.
 *     'backgroundPosition: (string) The background postition x, y.
 * @param {number=} opt_padding Optional padding to apply to the cluster icon.
 * @constructor
 * @extends google.maps.OverlayView
 * @ignore
 */
function ClusterIcon(cluster, styles, opt_padding) {
  cluster.getMarkerClusterer().extend(ClusterIcon, google.maps.OverlayView);

  this.styles_ = styles;
  this.padding_ = opt_padding || 0;
  this.cluster_ = cluster;
  this.center_ = null;
  this.map_ = cluster.getMap();
  this.div_ = null;
  this.sums_ = null;
  this.visible_ = false;

  this.setMap(this.map_);
}

/**
 * Triggers the clusterclick event and zoom's if the option is set.
 */
ClusterIcon.prototype.triggerClusterClick = function () {
  var markerClusterer = this.cluster_.getMarkerClusterer();

  // Trigger the clusterclick event.
  google.maps.event.trigger(markerClusterer, 'clusterclick', this.cluster_);

  if (markerClusterer.isZoomOnClick()) {
    // Zoom into the cluster.
    this.map_.fitBounds(this.cluster_.getBounds());
  }
};

/**
 * Adding the cluster icon to the dom.
 * @ignore
 */
ClusterIcon.prototype.onAdd = function () {
  this.div_ = document.createElement('DIV');
  if (this.visible_) {
    var pos = this.getPosFromLatLng_(this.center_);
    this.div_.style.cssText = this.createCss(pos);
    this.div_.innerHTML = this.sums_.text;
  }

  var panes = this.getPanes();
  panes.overlayMouseTarget.appendChild(this.div_);

  var that = this;
  google.maps.event.addDomListener(this.div_, 'click', function () {
    that.triggerClusterClick();
  });
};

/**
 * Returns the position to place the div dending on the latlng.
 *
 * @param {google.maps.LatLng} latlng The position in latlng.
 * @return {google.maps.Point} The position in pixels.
 * @private
 */
ClusterIcon.prototype.getPosFromLatLng_ = function (latlng) {
  var pos = this.getProjection().fromLatLngToDivPixel(latlng);
  pos.x -= parseInt(this.width_ / 2, 10);
  pos.y -= parseInt(this.height_ / 2, 10);
  return pos;
};

/**
 * Draw the icon.
 * @ignore
 */
ClusterIcon.prototype.draw = function () {
  if (this.visible_) {
    var pos = this.getPosFromLatLng_(this.center_);
    this.div_.style.top = pos.y + 'px';
    this.div_.style.left = pos.x + 'px';
  }
};

/**
 * Hide the icon.
 */
ClusterIcon.prototype.hide = function () {
  if (this.div_) {
    this.div_.style.display = 'none';
  }
  this.visible_ = false;
};

/**
 * Position and show the icon.
 */
ClusterIcon.prototype.show = function () {
  if (this.div_) {
    var pos = this.getPosFromLatLng_(this.center_);
    this.div_.style.cssText = this.createCss(pos);
    this.div_.style.display = '';
  }
  this.visible_ = true;
};

/**
 * Remove the icon from the map
 */
ClusterIcon.prototype.remove = function () {
  this.setMap(null);
};

/**
 * Implementation of the onRemove interface.
 * @ignore
 */
ClusterIcon.prototype.onRemove = function () {
  if (this.div_ && this.div_.parentNode) {
    this.hide();
    this.div_.parentNode.removeChild(this.div_);
    this.div_ = null;
  }
};

/**
 * Set the sums of the icon.
 *
 * @param {Object} sums The sums containing:
 *   'text': (string) The text to display in the icon.
 *   'index': (number) The style index of the icon.
 */
ClusterIcon.prototype.setSums = function (sums) {
  this.sums_ = sums;
  this.text_ = sums.text;
  this.index_ = sums.index;
  if (this.div_) {
    this.div_.innerHTML = sums.text;
  }

  this.useStyle();
};

/**
 * Sets the icon to the the styles.
 */
ClusterIcon.prototype.useStyle = function () {
  var index = Math.max(0, this.sums_.index - 1);
  index = Math.min(this.styles_.length - 1, index);
  var style = this.styles_[index];
  this.url_ = style['url'];
  this.height_ = style['height'];
  this.width_ = style['width'];
  this.textColor_ = style['textColor'];
  this.anchor_ = style['anchor'];
  this.textSize_ = style['textSize'];
  this.backgroundPosition_ = style['backgroundPosition'];
};

/**
 * Sets the center of the icon.
 *
 * @param {google.maps.LatLng} center The latlng to set as the center.
 */
ClusterIcon.prototype.setCenter = function (center) {
  this.center_ = center;
};

/**
 * Create the css text based on the position of the icon.
 *
 * @param {google.maps.Point} pos The position.
 * @return {string} The css style text.
 */
ClusterIcon.prototype.createCss = function (pos) {
  var style = [];
  style.push('background-image:url(' + this.url_ + ');');
  var backgroundPosition = this.backgroundPosition_ ? this.backgroundPosition_ : '0 0';
  style.push('background-position:' + backgroundPosition + ';');

  if (babelHelpers.typeof(this.anchor_) === 'object') {
    if (typeof this.anchor_[0] === 'number' && this.anchor_[0] > 0 && this.anchor_[0] < this.height_) {
      style.push('height:' + (this.height_ - this.anchor_[0]) + 'px; padding-top:' + this.anchor_[0] + 'px;');
    } else {
      style.push('height:' + this.height_ + 'px; line-height:' + this.height_ + 'px;');
    }
    if (typeof this.anchor_[1] === 'number' && this.anchor_[1] > 0 && this.anchor_[1] < this.width_) {
      style.push('width:' + (this.width_ - this.anchor_[1]) + 'px; padding-left:' + this.anchor_[1] + 'px;');
    } else {
      style.push('width:' + this.width_ + 'px; text-align:center;');
    }
  } else {
    style.push('height:' + this.height_ + 'px; line-height:' + this.height_ + 'px; width:' + this.width_ + 'px; text-align:center;');
  }

  var txtColor = this.textColor_ ? this.textColor_ : 'black';
  var txtSize = this.textSize_ ? this.textSize_ : 11;

  style.push('cursor:pointer; top:' + pos.y + 'px; left:' + pos.x + 'px; color:' + txtColor + '; position:absolute; font-size:' + txtSize + 'px; font-family:Arial,sans-serif; font-weight:bold');
  return style.join('');
};

// Export Symbols for Closure
// If you are not going to compile with closure then you can remove the
// code below.
window['MarkerClusterer'] = MarkerClusterer;
MarkerClusterer.prototype['addMarker'] = MarkerClusterer.prototype.addMarker;
MarkerClusterer.prototype['addMarkers'] = MarkerClusterer.prototype.addMarkers;
MarkerClusterer.prototype['clearMarkers'] = MarkerClusterer.prototype.clearMarkers;
MarkerClusterer.prototype['fitMapToMarkers'] = MarkerClusterer.prototype.fitMapToMarkers;
MarkerClusterer.prototype['getCalculator'] = MarkerClusterer.prototype.getCalculator;
MarkerClusterer.prototype['getGridSize'] = MarkerClusterer.prototype.getGridSize;
MarkerClusterer.prototype['getExtendedBounds'] = MarkerClusterer.prototype.getExtendedBounds;
MarkerClusterer.prototype['getMap'] = MarkerClusterer.prototype.getMap;
MarkerClusterer.prototype['getMarkers'] = MarkerClusterer.prototype.getMarkers;
MarkerClusterer.prototype['getMaxZoom'] = MarkerClusterer.prototype.getMaxZoom;
MarkerClusterer.prototype['getStyles'] = MarkerClusterer.prototype.getStyles;
MarkerClusterer.prototype['getTotalClusters'] = MarkerClusterer.prototype.getTotalClusters;
MarkerClusterer.prototype['getTotalMarkers'] = MarkerClusterer.prototype.getTotalMarkers;
MarkerClusterer.prototype['redraw'] = MarkerClusterer.prototype.redraw;
MarkerClusterer.prototype['removeMarker'] = MarkerClusterer.prototype.removeMarker;
MarkerClusterer.prototype['removeMarkers'] = MarkerClusterer.prototype.removeMarkers;
MarkerClusterer.prototype['resetViewport'] = MarkerClusterer.prototype.resetViewport;
MarkerClusterer.prototype['repaint'] = MarkerClusterer.prototype.repaint;
MarkerClusterer.prototype['setCalculator'] = MarkerClusterer.prototype.setCalculator;
MarkerClusterer.prototype['setGridSize'] = MarkerClusterer.prototype.setGridSize;
MarkerClusterer.prototype['setMaxZoom'] = MarkerClusterer.prototype.setMaxZoom;
MarkerClusterer.prototype['onAdd'] = MarkerClusterer.prototype.onAdd;
MarkerClusterer.prototype['draw'] = MarkerClusterer.prototype.draw;

Cluster.prototype['getCenter'] = Cluster.prototype.getCenter;
Cluster.prototype['getSize'] = Cluster.prototype.getSize;
Cluster.prototype['getMarkers'] = Cluster.prototype.getMarkers;

ClusterIcon.prototype['onAdd'] = ClusterIcon.prototype.onAdd;
ClusterIcon.prototype['draw'] = ClusterIcon.prototype.draw;
ClusterIcon.prototype['onRemove'] = ClusterIcon.prototype.onRemove;

Object.keys = Object.keys || function (o) {
  var result = [];
  for (var name in o) {
    if (o.hasOwnProperty(name)) result.push(name);
  }
  return result;
};

var MapController = function () {
  function MapController(mapContainer) {
    babelHelpers.classCallCheck(this, MapController);

    this.markers = [];
    this.map = this.initMap(mapContainer);
    return this;
  }

  babelHelpers.createClass(MapController, [{
    key: 'initMap',
    value: function initMap(targetObject) {
      var options = {
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoom: 14,
        scrollwheel: false,
        maxZoom: 17
      };

      var map = new google.maps.Map(targetObject, options);
      return map;
    }
  }, {
    key: 'createRandomMarkers',
    value: function createRandomMarkers() {
      var amount = arguments.length <= 0 || arguments[0] === undefined ? 5 : arguments[0];
      var map = arguments.length <= 1 || arguments[1] === undefined ? this.map : arguments[1];

      var lngSpan = 0.17;
      var latSpan = 0.03;
      var myLatLng = new google.maps.LatLng(51.500524, -0.1769147);
      var markers = [];

      if (map === this.map) {
        this.clearAllMarkers(this.markers);
        this.markers = markers;
      }

      // Create some markers
      for (var i = 1; i < amount; i++) {
        var location = new google.maps.LatLng(myLatLng.lat() - latSpan / 2 + latSpan * Math.random(), myLatLng.lng() - lngSpan / 2 + lngSpan * Math.random());

        var marker = new google.maps.Marker({
          position: location,
          map: map
        });

        markers.push(marker);
      }

      this.createCluster(markers, map);
      this.centerOnMarkers(markers, map);
      return markers;
    }

    /**
     * @method createMarkersFromCoordinates
     * @param  {Array} coordinates Each element must have a latitude and a longitude
     * @param  {Object} map   Google Maps Object
     * @return {Array[Object]}
     */

  }, {
    key: 'createMarkersFromCoordinates',
    value: function createMarkersFromCoordinates(coordinates) {
      var map = arguments.length <= 1 || arguments[1] === undefined ? this.map : arguments[1];

      var markers = [];

      if (map === this.map) {
        this.clearAllMarkers(this.markers);
        this.markers = markers;
      }

      // Create some markers
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = coordinates[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var coord = _step.value;

          var location = new google.maps.LatLng(coord.latitude, coord.longitude);
          var marker = new google.maps.Marker({
            position: location,
            map: map
          });

          markers.push(marker);
        }
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

      this.centerOnMarkers(markers, map);
      return markers;
    }
  }, {
    key: 'centerOnMarkers',
    value: function centerOnMarkers() {
      var markers = arguments.length <= 0 || arguments[0] === undefined ? this.markers : arguments[0];
      var map = arguments.length <= 1 || arguments[1] === undefined ? this.map : arguments[1];

      var bounds = new google.maps.LatLngBounds();
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = markers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var marker = _step2.value;

          bounds.extend(marker.getPosition());
        }

        // Center the map according to our markers.
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

      map.fitBounds(bounds);
    }
  }, {
    key: 'createCluster',
    value: function createCluster() {
      var markers = arguments.length <= 0 || arguments[0] === undefined ? this.markers : arguments[0];
      var map = arguments.length <= 1 || arguments[1] === undefined ? this.map : arguments[1];

      var markerClustererOptions = {
        styles: [{
          textColor: 'white',
          url: '/img/marker.svg',
          height: 52,
          width: 31
        }],
        minimumClusterSize: 1
      };

      var markerCluster = new MarkerClusterer(map, markers, markerClustererOptions);
      return markerCluster;
    }
  }, {
    key: 'clearAllMarkers',
    value: function clearAllMarkers() {
      var markers = arguments.length <= 0 || arguments[0] === undefined ? this.markers : arguments[0];

      while (markers.length) {
        markers.pop().setMap(null);
      }

      return markers;
    }
  }, {
    key: 'triggerResize',
    value: function triggerResize() {
      var map = arguments.length <= 0 || arguments[0] === undefined ? this.map : arguments[0];

      google.maps.event.trigger(map, 'resize');
      // map.setZoom(map.getZoom());
      map.setZoom(16);
    }
  }]);
  return MapController;
}();

var MAP_TARGET_SELECTOR = '.js-property-map';
var MAP_LABEL_SELECTOR = '.js-map-label';

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
  var tabsContainer = document.querySelector('.js-property-article-tab-labels');
  assert(tabsContainer && tabsContainer.nodeName, 'Tab labels not found.');

  var buttons = tabsContainer.children;
  var activeIndex = 0;
  var highlightOnClick = true;
  new ActiveHighlighter({ // eslint-disable-line no-new
    buttons: buttons,
    activeIndex: activeIndex,
    highlightOnClick: highlightOnClick
  });
})();

(function controlButtons() {
  var printBtn = document.querySelector('.js-article-print');
  printBtn.addEventListener('click', function () {
    return window.print();
  });

  // const mailBtn = document.querySelector('.js-article-mail');
  // mailBtn.addEventListener('click', () => window.print());
  //
  // const shareBtn = document.querySelector('.js-article-share');
  // shareBtn.addEventListener('click', () => window.print());
})();

(function showOnMap() {
  // Create map and instantiate a controller
  var mapContainer = document.querySelector(MAP_TARGET_SELECTOR);
  if (!mapContainer) {
    return;
  }
  var mapController = new MapController(mapContainer);

  // Add a property marker to map
  mapController.createMarkersFromCoordinates([PROPERTY_INFO.address]);
  mapController.createCluster();

  // NOTE: Google maps has some problems being initialised hidden. Therefore
  // to make it show propperly we trigger an artificial resize event.
  // We need to set a delay to give preference for the css chage of the
  // display property in the execution queue before triggering the resize.
  var mapLabel = document.querySelector(MAP_LABEL_SELECTOR);

  mapLabel.addEventListener('click', function () {
    setTimeout(function () {
      mapController.triggerResize();
      mapController.centerOnMarkers();
    }, 50);
  });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJwcm9wZXJ0eS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBnbG9iYWxzIFBST1BFUlRZX0lORk8qL1xuaW1wb3J0IGFzc2VydCBmcm9tICcuL19zaGFyZWQvYXNzZXJ0LmpzJztcblxuYXNzZXJ0KFBST1BFUlRZX0lORk8sICdObyBQUk9QRVJUWV9JTkZPIG9iamVjdCBwcm92aWRlZC4nKTtcblxuaW1wb3J0IEFjdGl2ZUhpZ2hsaWdodGVyIGZyb20gJy4vX3NoYXJlZC9BY3RpdmVIaWdobGlnaHRlcic7XG5pbXBvcnQgTWFwQ29udHJvbGxlciBmcm9tICcuL3NlYXJjaC9fTWFwQ29udHJvbGxlci5qcyc7XG5cbmNvbnN0IE1BUF9UQVJHRVRfU0VMRUNUT1IgPSAnLmpzLXByb3BlcnR5LW1hcCc7XG5jb25zdCBNQVBfTEFCRUxfU0VMRUNUT1IgPSAnLmpzLW1hcC1sYWJlbCc7XG5cbi8vIFRPRE86IEFkZCB0aGVzZSBtZXRhIHByb3BlcnRpZXMgc28gd2UgaGF2ZSBhIG5pY2UgdGh1bWJuYWlsIHdoZW4gc2hhcmluZ1xuLy8gYSBsaW5rIHRvIHRoZSBwcm9wZXJ0eS5cbi8vIChmdW5jdGlvbiBhZGRNZXRhUHJvcGVydGllcygpIHtcbi8vICAgY29uc3QgbWVkaWFQcm9wZXJ0aWVzID0gYFxuLy8gICA8bWV0YSBwcm9wZXJ0eT1cIm9nOnVybFwiICAgICAgICAgICBjb250ZW50PVwiaHR0cDovL3d3dy5ldm9sdi5sb25kb25cIiAvPlxuLy8gXHQ8bWV0YSBwcm9wZXJ0eT1cIm9nOnR5cGVcIiAgICAgICAgICBjb250ZW50PVwid2Vic2l0ZVwiIC8+XG4vLyBcdDxtZXRhIHByb3BlcnR5PVwib2c6dGl0bGVcIiAgICAgICAgIGNvbnRlbnQ9XCJFdm9sdlwiIC8+XG4vLyBcdDxtZXRhIHByb3BlcnR5PVwib2c6ZGVzY3JpcHRpb25cIiAgIGNvbnRlbnQ9XCJMdXh1cnkgTG9uZG9uIExpdmluZ1wiIC8+XG4vLyBcdDxtZXRhIHByb3BlcnR5PVwib2c6aW1hZ2VcIiAgICAgICAgIGNvbnRlbnQ9XCIvaW1nL3Byb3AtaW1nLTQuanBnXCIgLz5gO1xuLy9cbi8vICAgZG9jdW1lbnQuaGVhZC5pbm5lckhUTUwgKz0gbWVkaWFQcm9wZXJ0aWVzO1xuLy8gfSgpKTtcblxuXG4oZnVuY3Rpb24gY29udHJvbFByb3BlcnR5VGFicygpIHtcbiAgY29uc3QgdGFic0NvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1wcm9wZXJ0eS1hcnRpY2xlLXRhYi1sYWJlbHMnKTtcbiAgYXNzZXJ0KHRhYnNDb250YWluZXIgJiYgdGFic0NvbnRhaW5lci5ub2RlTmFtZSwgJ1RhYiBsYWJlbHMgbm90IGZvdW5kLicpO1xuXG4gIGNvbnN0IGJ1dHRvbnMgPSB0YWJzQ29udGFpbmVyLmNoaWxkcmVuO1xuICBjb25zdCBhY3RpdmVJbmRleCA9IDA7XG4gIGNvbnN0IGhpZ2hsaWdodE9uQ2xpY2sgPSB0cnVlO1xuICBuZXcgQWN0aXZlSGlnaGxpZ2h0ZXIoeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ld1xuICAgIGJ1dHRvbnMsXG4gICAgYWN0aXZlSW5kZXgsXG4gICAgaGlnaGxpZ2h0T25DbGljayxcbiAgfSk7XG59KCkpO1xuXG5cbihmdW5jdGlvbiBjb250cm9sQnV0dG9ucygpIHtcbiAgY29uc3QgcHJpbnRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtYXJ0aWNsZS1wcmludCcpO1xuICBwcmludEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHdpbmRvdy5wcmludCgpKTtcblxuICAvLyBjb25zdCBtYWlsQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLWFydGljbGUtbWFpbCcpO1xuICAvLyBtYWlsQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gd2luZG93LnByaW50KCkpO1xuICAvL1xuICAvLyBjb25zdCBzaGFyZUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1hcnRpY2xlLXNoYXJlJyk7XG4gIC8vIHNoYXJlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gd2luZG93LnByaW50KCkpO1xufSgpKTtcblxuKGZ1bmN0aW9uIHNob3dPbk1hcCgpIHtcbiAgLy8gQ3JlYXRlIG1hcCBhbmQgaW5zdGFudGlhdGUgYSBjb250cm9sbGVyXG4gIGNvbnN0IG1hcENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoTUFQX1RBUkdFVF9TRUxFQ1RPUik7XG4gIGlmICghbWFwQ29udGFpbmVyKSB7IHJldHVybjsgfVxuICBjb25zdCBtYXBDb250cm9sbGVyID0gbmV3IE1hcENvbnRyb2xsZXIobWFwQ29udGFpbmVyKTtcblxuICAvLyBBZGQgYSBwcm9wZXJ0eSBtYXJrZXIgdG8gbWFwXG4gIG1hcENvbnRyb2xsZXIuY3JlYXRlTWFya2Vyc0Zyb21Db29yZGluYXRlcyhbUFJPUEVSVFlfSU5GTy5hZGRyZXNzXSk7XG4gIG1hcENvbnRyb2xsZXIuY3JlYXRlQ2x1c3RlcigpO1xuXG4gIC8vIE5PVEU6IEdvb2dsZSBtYXBzIGhhcyBzb21lIHByb2JsZW1zIGJlaW5nIGluaXRpYWxpc2VkIGhpZGRlbi4gVGhlcmVmb3JlXG4gIC8vIHRvIG1ha2UgaXQgc2hvdyBwcm9wcGVybHkgd2UgdHJpZ2dlciBhbiBhcnRpZmljaWFsIHJlc2l6ZSBldmVudC5cbiAgLy8gV2UgbmVlZCB0byBzZXQgYSBkZWxheSB0byBnaXZlIHByZWZlcmVuY2UgZm9yIHRoZSBjc3MgY2hhZ2Ugb2YgdGhlXG4gIC8vIGRpc3BsYXkgcHJvcGVydHkgaW4gdGhlIGV4ZWN1dGlvbiBxdWV1ZSBiZWZvcmUgdHJpZ2dlcmluZyB0aGUgcmVzaXplLlxuICBjb25zdCBtYXBMYWJlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoTUFQX0xBQkVMX1NFTEVDVE9SKTtcblxuICBtYXBMYWJlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIG1hcENvbnRyb2xsZXIudHJpZ2dlclJlc2l6ZSgpO1xuICAgICAgbWFwQ29udHJvbGxlci5jZW50ZXJPbk1hcmtlcnMoKTtcbiAgICB9LCA1MCk7XG4gIH0pO1xufSgpKTtcbiJdLCJmaWxlIjoicHJvcGVydHkuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
