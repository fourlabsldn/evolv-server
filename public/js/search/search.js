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

/*

  arg.js - v1.3
  JavaScript URL argument processing once and for all.

  by Mat Ryer and Ryan Quinn
  Copyright (c) 2013 Stretchr, Inc.

  Please consider promoting this project if you find it useful.

  Permission is hereby granted, free of charge, to any person obtaining a copy of this
  software and associated documentation files (the "Software"), to deal in the Software
  without restriction, including without limitation the rights to use, copy, modify, merge,
  publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
  to whom the Software is furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all copies
  or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
  INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
  PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
  FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
  OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
  DEALINGS IN THE SOFTWARE.

*/

var globalObj = {};

(function (global) {

  /**
   * MakeArg makes the Arg namespace.
   * var Arg = MakeArg();
   */
  global.MakeArg = function () {

    /** @namespace
     */
    var Arg = function Arg() {
      return Arg.get.apply(global, arguments);
    };
    Arg.version = "1.2.0";

    /**
     * Parses the arg string into an Arg.Arg object.
     */
    Arg.parse = function (s) {
      if (!s) return {};
      if (s.indexOf("=") === -1 && s.indexOf("&") === -1) return {};
      s = Arg._cleanParamStr(s);
      var obj = {};
      var pairs = s.split("&");
      for (var pi in pairs) {
        if (pairs.hasOwnProperty(pi)) {
          var kvsegs = pairs[pi].split("=");
          var key = decodeURIComponent(kvsegs[0]),
              val = Arg.__decode(kvsegs[1]);
          Arg._access(obj, key, val);
        }
      }
      return obj;
    };

    /**
     * Decodes a URL component (including resolving + to spaces)
     */
    Arg.__decode = function (s) {
      while (s && s.indexOf("+") > -1) {
        s = s.replace("+", " ");
      };
      s = decodeURIComponent(s);
      return s;
    };

    /**
     * Helper method to get/set deep nested values in an object based on a string selector
     *
     * @param  {Object}  obj        Based object to either get/set selector on
     * @param  {String}  selector   Object selector ie foo[0][1].bar[0].baz.foobar
     * @param  {Mixed}   value      (optional) Value to set leaf located at `selector` to.
     *                              If value is undefined, operates in 'get' mode to return value at obj->selector
     * @return {Mixed}
     */
    Arg._access = function (obj, selector, value) {
      var shouldSet = typeof value !== "undefined";
      var selectorBreak = -1;
      var coerce_types = {
        'true': true,
        'false': false,
        'null': null
      };

      // selector could be a number if we're at a numerical index leaf in which case selector.search is not valid
      if (typeof selector == 'string' || toString.call(selector) == '[object String]') {
        selectorBreak = selector.search(/[\.\[]/);
      }

      // No dot or array notation so we're at a leaf, set value
      if (selectorBreak === -1) {
        if (Arg.coerceMode) {
          value = value && !isNaN(value) ? +value // number
          : value === 'undefined' ? undefined // undefined
          : coerce_types[value] !== undefined ? coerce_types[value] // true, false, null
          : value; // string
        }
        return shouldSet ? obj[selector] = value : obj[selector];
      }

      // Example:
      // selector     = 'foo[0].bar.baz[2]'
      // currentRoot  = 'foo'
      // nextSelector = '0].bar.baz[2]' -> will be converted to '0.bar.baz[2]' in below switch statement
      var currentRoot = selector.substr(0, selectorBreak);
      var nextSelector = selector.substr(selectorBreak + 1);

      switch (selector.charAt(selectorBreak)) {
        case '[':
          // Intialize node as an array if we haven't visted it before
          obj[currentRoot] = obj[currentRoot] || [];
          nextSelector = nextSelector.replace(']', '');

          if (nextSelector.search(/[\.\[]/) === -1) {
            nextSelector = parseInt(nextSelector, 10);
          }

          return Arg._access(obj[currentRoot], nextSelector, value);
        case '.':
          // Intialize node as an object if we haven't visted it before
          obj[currentRoot] = obj[currentRoot] || {};
          return Arg._access(obj[currentRoot], nextSelector, value);
      }

      return obj;
    };

    /**
     * Turns the specified object into a URL parameter string.
     */
    Arg.stringify = function (obj, keyPrefix) {

      switch (typeof obj === "undefined" ? "undefined" : babelHelpers.typeof(obj)) {
        case "object":
          var segs = [];
          var thisKey;
          for (var key in obj) {

            if (!obj.hasOwnProperty(key)) continue;
            var val = obj[key];

            if (typeof key === "undefined" || key.length === 0 || typeof val === "undefined" || val.length === 0) continue;

            thisKey = keyPrefix ? keyPrefix + "." + key : key;

            if (typeof obj.length !== "undefined") {
              thisKey = keyPrefix ? keyPrefix + "[" + key + "]" : key;
            }

            if ((typeof val === "undefined" ? "undefined" : babelHelpers.typeof(val)) === "object") {
              segs.push(Arg.stringify(val, thisKey));
            } else {
              segs.push(encodeURIComponent(thisKey) + "=" + encodeURIComponent(val));
            }
          }
          return segs.join("&");
      }

      return encodeURIComponent(obj);
    };

    /**
     * Generates a URL with the given parameters.
     * (object) = A URL to the current page with the specified parameters.
     * (path, object) = A URL to the specified path, with the object of parameters.
     * (path, object, object) = A URL to the specified path with the first object as query parameters,
     * and the second object as hash parameters.
     */
    Arg.url = function () {

      var sep = Arg.urlUseHash ? Arg.hashQuerySeperator : Arg.querySeperator;
      var segs = [location.pathname, sep];
      var args = {};

      switch (arguments.length) {
        case 1:
          // Arg.url(params)
          segs.push(Arg.stringify(arguments[0]));
          break;
        case 2:
          // Arg.url(path, params)
          segs[0] = Arg._cleanPath(arguments[0]);
          args = Arg.parse(arguments[0]);
          args = Arg.merge(args, arguments[1]);
          segs.push(Arg.stringify(args));
          break;
        case 3:
          // Arg.url(path, query, hash)
          segs[0] = Arg._cleanPath(arguments[0]);
          segs[1] = Arg.querySeperator;
          segs.push(Arg.stringify(arguments[1]));
          typeof arguments[2] === "string" ? segs.push(Arg.hashSeperator) : segs.push(Arg.hashQuerySeperator);
          segs.push(Arg.stringify(arguments[2]));
      }

      var s = segs.join("");

      // trim off sep if it's the last thing
      if (s.indexOf(sep) == s.length - sep.length) {
        s = s.substr(0, s.length - sep.length);
      }

      return s;
    };

    /** urlUseHash tells the Arg.url method to always put the parameters in the hash. */
    Arg.urlUseHash = false;

    /** The string that seperates the path and query parameters. */
    Arg.querySeperator = "?";

    /** The string that seperates the path or query, and the hash property. */
    Arg.hashSeperator = "#";

    /** The string that seperates the the path or query, and the hash query parameters. */
    Arg.hashQuerySeperator = "#?";

    /** When parsing values if they should be coerced into primitive types, ie Number, Boolean, Undefined */
    Arg.coerceMode = true;

    /**
     * Gets all parameters from the current URL.
     */
    Arg.all = function () {
      var merged = Arg.parse(Arg.querystring() + "&" + Arg.hashstring());
      return Arg._all ? Arg._all : Arg._all = merged;
    };

    /**
     * Gets a parameter from the URL.
     */
    Arg.get = function (selector, def) {
      var val = Arg._access(Arg.all(), selector);
      return typeof val === "undefined" ? def : val;
    };

    /**
     * Gets the query string parameters from the current URL.
     */
    Arg.query = function () {
      return Arg._query ? Arg._query : Arg._query = Arg.parse(Arg.querystring());
    };

    /**
     * Gets the hash string parameters from the current URL.
     */
    Arg.hash = function () {
      return Arg._hash ? Arg._hash : Arg._hash = Arg.parse(Arg.hashstring());
    };

    /**
     * Gets the query string from the URL (the part after the ?).
     */
    Arg.querystring = function () {
      return Arg._cleanParamStr(location.search);
    };

    /**
     * Gets the hash param string from the URL (the part after the #).
     */
    Arg.hashstring = function () {
      return Arg._cleanParamStr(location.hash);
    };

    /*
     * Cleans the URL parameter string stripping # and ? from the beginning.
     */
    Arg._cleanParamStr = function (s) {

      if (s.indexOf(Arg.querySeperator) > -1) s = s.split(Arg.querySeperator)[1];

      if (s.indexOf(Arg.hashSeperator) > -1) s = s.split(Arg.hashSeperator)[1];

      if (s.indexOf("=") === -1 && s.indexOf("&") === -1) return "";

      while (s.indexOf(Arg.hashSeperator) == 0 || s.indexOf(Arg.querySeperator) == 0) {
        s = s.substr(1);
      }return s;
    };

    Arg._cleanPath = function (p) {

      if (p.indexOf(Arg.querySeperator) > -1) p = p.substr(0, p.indexOf(Arg.querySeperator));

      if (p.indexOf(Arg.hashSeperator) > -1) p = p.substr(0, p.indexOf(Arg.hashSeperator));

      return p;
    };

    /**
     * Merges all the arguments into a new object.
     */
    Arg.merge = function () {
      var all = {};
      for (var ai in arguments) {
        if (arguments.hasOwnProperty(ai)) {
          for (var k in arguments[ai]) {
            if (arguments[ai].hasOwnProperty(k)) {
              all[k] = arguments[ai][k];
            }
          }
        }
      }
      return all;
    };
    return Arg;
  };

  /** @namespace
   * Arg is the root namespace for all arg.js functionality.
   */
  global.Arg = global.MakeArg();
})(globalObj);

var MakeArg = globalObj.MakeArg;

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

// class-wide globals

// Search filters options containing a 'selected' attribute will be considered
// placeholder options and will receive this value;
var PLACEHOLDER_VALUE = '';
var HIDDEN_CLASS = 'hidden';
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

var SearchController = function () {

  /**
   * @constructor
   * @param  {String} searchBarSelector        [description]
   * @param  {String} searchFieldsSelector     [description]
   * @param  {String} targetsContainerSelector [description]
   * @param  {String} infoElSelector           [description]
   * @param  {Function} filtersAppliedcallback   to be called with 'matches'
   * 																						 and 'nonMatches' as parameters
   */

  function SearchController() {
    var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    babelHelpers.classCallCheck(this, SearchController);

    var searchBarSelector = config.searchBarSelector;
    var searchFieldsSelector = config.searchFieldsSelector;
    var targetsContainerSelector = config.targetsContainerSelector;
    var infoElSelector = config.infoElSelector;
    var filtersAppliedcallback = config.filtersAppliedcallback;

    // Get search bar
    var searchBarEl = document.querySelector(searchBarSelector);
    assert(searchBarEl && searchBarEl.nodeName, 'No search bar found using selectos \'' + searchBarSelector + '\'');
    this.searchBarEl = searchBarEl;

    // Get search fields
    var filters = Array.from(searchBarEl.querySelectorAll(searchFieldsSelector));
    assert(filters && filters.length, 'No search fields found with selector \'' + searchFieldsSelector + '\'');
    // Let's reverse it so that in the search, the text input element is searched
    // last as it fits multiple criteria and shadows other elements in the
    // filter search.
    this.filters = filters.reverse();

    // Get search targets container. It contains the elements
    // that will be searched for.
    var targetsContainer = document.querySelector(targetsContainerSelector);
    assert(targetsContainer && targetsContainer.nodeName, 'No valid search container found using selector ' + targetsContainerSelector + '.');
    this.targetsContainer = targetsContainer;

    // Get info element. where we will show a message if anything goes wrong.
    var infoEl = document.querySelector(infoElSelector);
    assert(infoEl && infoEl.nodeName, 'No valid info element found using selector ' + infoElSelector + '.');
    this.infoEl = infoEl;

    if (typeof filtersAppliedcallback === 'function') {
      this.filtersAppliedcallback = filtersAppliedcallback;
    } else {
      this.filtersAppliedcallback = function () {
        return null;
      };
    }

    // Begin UI control
    handleUI(filters);

    // Prepare filters
    this._initFilterElements(filters);
  }

  // ===========================================================================
  //    FUNCTIONALITY CONTROLS
  // ===========================================================================

  babelHelpers.createClass(SearchController, [{
    key: '_initFilterElements',
    value: function _initFilterElements() {
      var _this = this;

      var filters = arguments.length <= 0 || arguments[0] === undefined ? this.filters : arguments[0];

      // Listen to changes to all filters so we can trigger a search
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = filters[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var filter = _step.value;

          var checkEvent = filter.nodeName === 'SELECT' ? 'change' : 'keyup';
          filter.addEventListener(checkEvent, function () {
            _this.applyFilters();
          });
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
    }
    /**
     * @method applyFilters
     * @param  {Array[HTMLElement]} filters
     * @param  {HTMLElement} targetsContainer
     * @param  {HTMLElement} infoEl Element to show info about the search.
     * @return {Array[HTMLElement]} Array of elements that matched the search
     */

  }, {
    key: 'applyFilters',
    value: function applyFilters() {
      var filters = arguments.length <= 0 || arguments[0] === undefined ? this.filters : arguments[0];
      var targetsContainer = arguments.length <= 1 || arguments[1] === undefined ? this.targetsContainer : arguments[1];
      var infoEl = arguments.length <= 2 || arguments[2] === undefined ? this.infoEl : arguments[2];

      assert(filters, 'No filters provided.');
      assert(targetsContainer, 'No filter targets container provided');
      assert(infoEl, 'No info element provided');

      var targets = Array.from(targetsContainer.children);
      if (targets.length === 0) {
        console.warn('No target elements being filtered.');
      }

      var matches = [];
      var nonMatches = [];

      // run through all target elements
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = targets[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var target = _step2.value;

          // Check whether it matches all filters
          var match = targetMatchesFilters(target, filters);

          // Show or hide it based on that
          var destination = match ? matches : nonMatches;
          destination.push(target);
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

      matches.forEach(function (el) {
        show(el, true);
      });
      nonMatches.forEach(function (el) {
        show(el, false);
      });

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

  }, {
    key: 'fillFilter',
    value: function fillFilter(filterReference, value) {
      var filters = arguments.length <= 2 || arguments[2] === undefined ? this.filters : arguments[2];

      var filter = void 0;

      if (typeof filterReference === 'number') {
        // index was provided
        filter = filters[filterReference];
      } else {
        // The filter itself was provided.
        filter = filterReference;
      }

      assert(filter && filter.nodeName, 'Invalid \'filterReference\' provided: ' + filter);
      assert(typeof value === 'string', 'Invalid \'value\' value: ' + value);

      var isTypeableInput = filter.nodeName === 'INPUT' && filter.getAttribute('type') && (filter.getAttribute('type').toLowerCase() === 'search' || filter.getAttribute('type').toLowerCase() === 'text');

      if (isTypeableInput) {
        filter.value = value;
      } else if (filter.nodeName === 'SELECT') {
        // Let's get the value of all the options in the select
        var optionElements = Array.from(filter.querySelectorAll('option'));
        var optionValues = optionElements.map(function (optionEl) {
          // If it is set as selected is because it is a placeholder option.
          if (optionEl.selected) {
            return PLACEHOLDER_VALUE;
          }
          return optionEl.getAttribute('value') || optionEl.innerHTML;
        });

        var valueOptionIndex = optionValues.findIndex(function (optionValue) {
          return searchMatch(value, optionValue);
        });

        if (valueOptionIndex > -1) {
          filter.selectedIndex = valueOptionIndex;
        } else {
          // The value was not found, so let's just do nothing.
          console.warn('No option available for value \'' + value + '\'');
        }
      }
    }
  }, {
    key: 'getFilterByCriterion',
    value: function getFilterByCriterion(criterion) {
      var filters = arguments.length <= 1 || arguments[1] === undefined ? this.filters : arguments[1];
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = filters[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var filter = _step3.value;

          var filterCriteria = getFilterCriteria(filter);
          if (filterCriteria.indexOf(criterion) > -1) {
            return filter;
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      return null;
    }
  }]);
  return SearchController;
}();

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

  var foundInsideTxt1 = txt1.indexOf(txt2) >= 0;
  var foundInsideTxt2 = txt2.indexOf(txt1) >= 0;
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
  var criteriaString = filter.dataset.criteria;
  if (typeof criteriaString !== 'string') {
    return [];
  }

  var criteria = criteriaString.split(' ');
  return criteria;
}

function targetMatchesFilters(target, filters) {
  var matched = true;

  // Check if it matches all filters
  var _iteratorNormalCompletion4 = true;
  var _didIteratorError4 = false;
  var _iteratorError4 = undefined;

  try {
    for (var _iterator4 = filters[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
      var filter = _step4.value;

      var criteria = getFilterCriteria(filter);

      var value = filter.value;

      // Placeholder values do not make a match fail.
      if (value === PLACEHOLDER_VALUE) {
        continue;
      }

      var filterMatched = false;

      // Check against all criteria for the filter;
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = criteria[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var criterion = _step5.value;

          var targetPropertyValue = getTargetProperty(target, criterion) || '';
          // If it matches any criterion, then it matches the filter.
          if (searchMatch(value, targetPropertyValue)) {
            filterMatched = true;
            break;
          }
        }

        // If it doesn't match any one of the filters, then it is not a
        // search match.
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }

      if (!filterMatched) {
        matched = false;
        break;
      }
    }
  } catch (err) {
    _didIteratorError4 = true;
    _iteratorError4 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion4 && _iterator4.return) {
        _iterator4.return();
      }
    } finally {
      if (_didIteratorError4) {
        throw _iteratorError4;
      }
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
  assert(filters && filters.length > 0, 'No search filters provided.');

  function getButtonContainer(btn) {
    if (btn.nodeName && btn.nodeName === 'INPUT') {
      return btn.parentElement;
    }
    return btn;
  }

  // Highlight field on focus and leave it
  // highlighted if anything was changed in the options.
  var _iteratorNormalCompletion6 = true;
  var _didIteratorError6 = false;
  var _iteratorError6 = undefined;

  try {
    var _loop = function _loop() {
      var filter = _step6.value;

      filter.addEventListener('blur', function () {
        var filledInput = filter.value && filter.value.trim().length > 0;
        var nonPlaceholderOptionSelected = filter.selectedIndex && filter.selectedIndex > 0;

        if (!filledInput && !nonPlaceholderOptionSelected) {
          var container = getButtonContainer(filter);
          container.classList.remove('search-bar-btn-active');
        }
      });

      filter.addEventListener('focus', function () {
        var container = getButtonContainer(filter);
        container.classList.add('search-bar-btn-active');
      });
    };

    for (var _iterator6 = filters[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
      _loop();
    }
  } catch (err) {
    _didIteratorError6 = true;
    _iteratorError6 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion6 && _iterator6.return) {
        _iterator6.return();
      }
    } finally {
      if (_didIteratorError6) {
        throw _iteratorError6;
      }
    }
  }
}
// ------------------------END OF UI CONTROL ----------------------

// Global values
var SEARCH_BAR_SELECTOR = '.search-bar';
var MAP_TARGET_SELECTOR = '.js-property-map';
var TILES_LIST_CONTAINER_SELECTOR = '.js-property-list';
var SEARCH_INPUT_SELECTOR = '.js-search-input';
var SEARCH_INFO_SELECTOR = '.js-search-info';

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

function fillSearchFromQueryParameters(searchController) {
  var Arg = MakeArg(); // eslint-disable-line new-cap
  var getParameters = Arg.all();
  var getParametersKeys = Object.keys(getParameters);

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = getParametersKeys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var par = _step.value;

      var filter = searchController.getFilterByCriterion(par);
      if (filter) {
        var value = getParameters[par];
        value = typeof value === 'string' ? value : value.toString();
        searchController.fillFilter(filter, value);
      }
    }

    // Now we apply the filter.
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

  searchController.applyFilters();
}

function initPage() {
  // Start control of search bar
  var searchControllerConfig = {
    searchBarSelector: SEARCH_BAR_SELECTOR,
    searchFieldsSelector: SEARCH_INPUT_SELECTOR,
    targetsContainerSelector: TILES_LIST_CONTAINER_SELECTOR,
    infoElSelector: SEARCH_INFO_SELECTOR,
    // filter applied callback
    filtersAppliedcallback: function filtersAppliedcallback(matches) {
      var coordinates = [];
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = matches[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var tile = _step2.value;

          if (!tile.dataset.longitude || !tile.dataset.latitude) {
            continue;
          }

          coordinates.push({
            latitude: tile.dataset.latitude,
            longitude: tile.dataset.longitude
          });
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

      showOnMap(coordinates, mapController);
    }
  };

  var searchController = new SearchController(searchControllerConfig);

  // Create map and instantiate a controller
  var mapController = new MapController(MAP_TARGET_SELECTOR);

  fillSearchFromQueryParameters(searchController, mapController);
}

initPage();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzZWFyY2gvc2VhcmNoLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBNYWtlQXJnIGZyb20gJy4uL19zaGFyZWQvTWFrZUFyZyc7XG5pbXBvcnQgTWFwQ29udHJvbGxlciBmcm9tICcuL19NYXBDb250cm9sbGVyLmpzJztcbmltcG9ydCBTZWFyY2hDb250cm9sbGVyIGZyb20gJy4vX1NlYXJjaENvbnRyb2xsZXIuanMnO1xuXG4vLyBHbG9iYWwgdmFsdWVzXG5jb25zdCBTRUFSQ0hfQkFSX1NFTEVDVE9SID0gJy5zZWFyY2gtYmFyJztcbmNvbnN0IE1BUF9UQVJHRVRfU0VMRUNUT1IgPSAnLmpzLXByb3BlcnR5LW1hcCc7XG5jb25zdCBUSUxFU19MSVNUX0NPTlRBSU5FUl9TRUxFQ1RPUiA9ICcuanMtcHJvcGVydHktbGlzdCc7XG5jb25zdCBTRUFSQ0hfSU5QVVRfU0VMRUNUT1IgPSAnLmpzLXNlYXJjaC1pbnB1dCc7XG5jb25zdCBTRUFSQ0hfSU5GT19TRUxFQ1RPUiA9ICcuanMtc2VhcmNoLWluZm8nO1xuXG4vKipcbiAqIERpc3BsYXkgcHJvcGVydGllcyBvbiB0aGUgbWFwXG4gKiBAZnVuY3Rpb24gc2hvd09uTWFwXG4gKiBAcGFyYW0gIHtBcnJheX0gY29vcmRpbmF0ZXMgRWFjaCBpdGVtIGluIHRoZSAnY29vcmRpbmF0ZScgYXJyYXlcbiAqICAgICAgICAgICAgICAgICBtdXN0IGhhdmUgYSAnbGF0aXR1ZGUnIGFuZCBhICdsb25naXR1ZGUnIHByb3BlcnR5XG4gKiBAcGFyYW0gIHtPYmplY3R9IG1hcENvbnRyb2xsZXJcbiAqIEByZXR1cm4ge3ZvaWR9XG4gKi9cbmZ1bmN0aW9uIHNob3dPbk1hcChjb29yZGluYXRlcywgbWFwQ29udHJvbGxlcikge1xuICBtYXBDb250cm9sbGVyLmNyZWF0ZU1hcmtlcnNGcm9tQ29vcmRpbmF0ZXMoY29vcmRpbmF0ZXMpO1xuICBtYXBDb250cm9sbGVyLmNyZWF0ZUNsdXN0ZXIoKTtcbn1cblxuXG5mdW5jdGlvbiBmaWxsU2VhcmNoRnJvbVF1ZXJ5UGFyYW1ldGVycyhzZWFyY2hDb250cm9sbGVyKSB7XG4gIGNvbnN0IEFyZyA9IE1ha2VBcmcoKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuZXctY2FwXG4gIGNvbnN0IGdldFBhcmFtZXRlcnMgPSBBcmcuYWxsKCk7XG4gIGNvbnN0IGdldFBhcmFtZXRlcnNLZXlzID0gT2JqZWN0LmtleXMoZ2V0UGFyYW1ldGVycyk7XG5cbiAgZm9yIChjb25zdCBwYXIgb2YgZ2V0UGFyYW1ldGVyc0tleXMpIHtcbiAgICBjb25zdCBmaWx0ZXIgPSBzZWFyY2hDb250cm9sbGVyLmdldEZpbHRlckJ5Q3JpdGVyaW9uKHBhcik7XG4gICAgaWYgKGZpbHRlcikge1xuICAgICAgbGV0IHZhbHVlID0gZ2V0UGFyYW1ldGVyc1twYXJdO1xuICAgICAgdmFsdWUgPSAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykgPyB2YWx1ZSA6IHZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICBzZWFyY2hDb250cm9sbGVyLmZpbGxGaWx0ZXIoZmlsdGVyLCB2YWx1ZSk7XG4gICAgfVxuICB9XG5cblxuICAvLyBOb3cgd2UgYXBwbHkgdGhlIGZpbHRlci5cbiAgc2VhcmNoQ29udHJvbGxlci5hcHBseUZpbHRlcnMoKTtcbn1cblxuXG5mdW5jdGlvbiBpbml0UGFnZSgpIHtcbiAgLy8gU3RhcnQgY29udHJvbCBvZiBzZWFyY2ggYmFyXG4gIGNvbnN0IHNlYXJjaENvbnRyb2xsZXJDb25maWcgPSB7XG4gICAgc2VhcmNoQmFyU2VsZWN0b3I6IFNFQVJDSF9CQVJfU0VMRUNUT1IsXG4gICAgc2VhcmNoRmllbGRzU2VsZWN0b3I6IFNFQVJDSF9JTlBVVF9TRUxFQ1RPUixcbiAgICB0YXJnZXRzQ29udGFpbmVyU2VsZWN0b3I6IFRJTEVTX0xJU1RfQ09OVEFJTkVSX1NFTEVDVE9SLFxuICAgIGluZm9FbFNlbGVjdG9yOiBTRUFSQ0hfSU5GT19TRUxFQ1RPUixcbiAgICAvLyBmaWx0ZXIgYXBwbGllZCBjYWxsYmFja1xuICAgIGZpbHRlcnNBcHBsaWVkY2FsbGJhY2s6IChtYXRjaGVzKSA9PiB7XG4gICAgICBjb25zdCBjb29yZGluYXRlcyA9IFtdO1xuICAgICAgZm9yIChjb25zdCB0aWxlIG9mIG1hdGNoZXMpIHtcbiAgICAgICAgaWYgKCF0aWxlLmRhdGFzZXQubG9uZ2l0dWRlIHx8ICF0aWxlLmRhdGFzZXQubGF0aXR1ZGUpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvb3JkaW5hdGVzLnB1c2goe1xuICAgICAgICAgIGxhdGl0dWRlOiB0aWxlLmRhdGFzZXQubGF0aXR1ZGUsXG4gICAgICAgICAgbG9uZ2l0dWRlOiB0aWxlLmRhdGFzZXQubG9uZ2l0dWRlXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBzaG93T25NYXAoY29vcmRpbmF0ZXMsIG1hcENvbnRyb2xsZXIpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBzZWFyY2hDb250cm9sbGVyID0gbmV3IFNlYXJjaENvbnRyb2xsZXIoc2VhcmNoQ29udHJvbGxlckNvbmZpZyk7XG5cbiAgLy8gQ3JlYXRlIG1hcCBhbmQgaW5zdGFudGlhdGUgYSBjb250cm9sbGVyXG4gIGNvbnN0IG1hcENvbnRyb2xsZXIgPSBuZXcgTWFwQ29udHJvbGxlcihNQVBfVEFSR0VUX1NFTEVDVE9SKTtcblxuICBmaWxsU2VhcmNoRnJvbVF1ZXJ5UGFyYW1ldGVycyhzZWFyY2hDb250cm9sbGVyLCBtYXBDb250cm9sbGVyKTtcbn1cblxuaW5pdFBhZ2UoKTtcbiJdLCJmaWxlIjoic2VhcmNoL3NlYXJjaC5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
