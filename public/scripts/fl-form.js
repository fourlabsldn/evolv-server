"use strict";

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
/**
 * Processes the message and outputs the correct message if the condition
 * is false. Otherwise it outputs null.
 * @api private
 * @method processCondition
 * @param  {Boolean} condition - Result of the evaluated condition
 * @param  {String} errorMessage - Message explainig the error in case it is thrown
 * @return {String | null}  - Error message if there is an error, nul otherwise.
 */
function processCondition(condition, errorMessage) {
  if (!condition) {
    var completeErrorMessage = '';

    // TODO: Use Error.stack to add caller names to functions.
    // Strict mode doesn't allow us to use callers
    // // The assert function is calling this processCondition and we are
    // // really interested is in who is calling the assert function.
    // const assertFunction = processCondition.caller;
    //
    // if (!assertFunction) {
    //   // The program should never ever ever come here.
    //   throw new Error('No "assert" function as a caller?');
    // }
    //
    // if (assertFunction.caller && assertFunction.caller.name) {
    //   completeErrorMessage = `${assertFunction.caller.name}: `;
    // }

    completeErrorMessage += errorMessage;
    return completeErrorMessage;
  }

  return null;
}

/**
 * Throws an error if the boolean passed to it evaluates to false.
 * To be used like this:
 * 		assert(myDate !== undefined, "Date cannot be undefined.");
 * @api public
 * @method assert
 * @param  {Boolean} condition - Result of the evaluated condition
 * @param  {String} errorMessage - Message explainig the error in case it is thrown
 * @return void
 */
function assert(condition, errorMessage) {
  var error = processCondition(condition, errorMessage);
  if (typeof error === 'string') {
    throw new Error(error);
  }
}

/**
 * Logs a warning if the boolean passed to it evaluates to false.
 * To be used like this:
 * 		assert.warn(myDate !== undefined, "No date provided.");
 * @api public
 * @method warn
 * @param  {Boolean} condition - Result of the evaluated condition
 * @param  {String} errorMessage - Message explainig the error in case it is thrown
 * @return void
 */
assert.warn = function warn(condition, errorMessage) {
  var error = processCondition(condition, errorMessage);
  if (typeof error === 'string') {
    console.warn(error);
  }
};

var FlForm = function () {
  function FlForm(xdiv) {
    var _this = this;

    var config = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    babelHelpers.classCallCheck(this, FlForm);

    assert(xdiv && xdiv.nodeName, 'No x-div element provided.');
    this.xdiv = xdiv;

    // Apply configurations
    this.config = config;
    this.setConfigurations(config);

    // Setup event listeners
    this.setupEventListeners();

    // trigger load event
    this.loadInitialContent().then(function () {
      _this.config.onLoad(xdiv);
    });
  }

  babelHelpers.createClass(FlForm, [{
    key: 'loadInitialContent',
    value: function loadInitialContent() {
      var _this2 = this;

      var config = arguments.length <= 0 || arguments[0] === undefined ? this.config : arguments[0];

      var url = typeof config.load === 'string' ? config.load : undefined;

      if (!url) {
        return Promise.resolve();
      }

      return this.sendRequest(url, 'get').then(function (res) {
        return _this2.processFormResponse(res);
      }).catch(function (err) {
        return assert.warn(false, err);
      });
    }

    /**
     * @method submitForm
     * @param  {HTMLElement} form - The form element to be submitted.
     * @return {Promise}  - A promise to be resolved with the response content
     * 												when the form submission response arrive
     * 												or with null if there is no submission URL.
     */

  }, {
    key: 'submitForm',
    value: function submitForm(form) {
      // Check that a valid element triggered the submit event.
      assert(form.tagName === 'FORM', 'Submit event was fired without a form element.');

      var url = form.getAttribute('action');
      if (!url) {
        return Promise.reject('No target url in form.');
      }

      // Prepare request options
      var method = form.getAttribute('method') || 'GET';
      var body = method.toUpperCase() === 'POST' ? new FormData(form) : undefined;

      return this.sendRequest(url, method, body);
    }
  }, {
    key: 'processFormResponse',
    value: function processFormResponse(response, status) {
      var _this3 = this;

      // If we have a response object rather than plain text,
      // then come back when we have plain text.
      if (response instanceof Response) {
        response.text().then(function (text) {
          _this3.processFormResponse(text, response.status);
        });
        return;
      }

      // Render to the DOM
      this.renderContent(response);

      // Announce that we are finished.
      this.config.onResponse(response, status, this.xdiv);
    }
  }, {
    key: 'setConfigurations',
    value: function setConfigurations() {
      var config = arguments.length <= 0 || arguments[0] === undefined ? this.config : arguments[0];

      assert((typeof config === 'undefined' ? 'undefined' : babelHelpers.typeof(config)) === 'object', 'Invalid configuration object');

      this.config.onLoad = typeof config.onLoad !== 'function' ? function () {
        return null;
      } : this.config.onLoad;

      this.config.onResponse = typeof config.onResponse !== 'function' ? function () {
        return null;
      } : this.config.onResponse;

      this.config.credentials = config.credentials ? 'include' : '';
      this.config.mode = config.credentials ? 'cors' : 'same-origin';
    }
  }, {
    key: 'setupEventListeners',
    value: function setupEventListeners() {
      var _this4 = this;

      var xdiv = arguments.length <= 0 || arguments[0] === undefined ? this.xdiv : arguments[0];

      xdiv.addEventListener('submit', function (e) {
        // Let's not allow the page to reload
        e.preventDefault();

        // Now we just submit and process the reponse
        var form = e.target;
        _this4.submitForm(form).then(function (res) {
          return _this4.processFormResponse(res);
        }).catch(function (err) {
          return assert.warn(false, err);
        });
      });
    }
  }, {
    key: 'renderContent',
    value: function renderContent(content) {
      var xdiv = arguments.length <= 1 || arguments[1] === undefined ? this.xdiv : arguments[1];

      xdiv.innerHTML = content;
    }
  }, {
    key: 'sendRequest',
    value: function sendRequest(url, method, body) {
      var config = arguments.length <= 3 || arguments[3] === undefined ? this.config : arguments[3];

      // Prepare request options
      var headers = new Headers({ 'X-Requested-With': 'fetch' });
      var fetchOptions = {
        method: method,
        body: body,
        headers: headers,
        cache: 'default',
        mode: config.mode,
        credentials: config.credentials
      };

      // Send request
      return fetch(url, fetchOptions);
    }
  }]);
  return FlForm;
}();

xController(function (xdiv) {
  assert(xdiv && xdiv.nodeName, 'Invalid x-div element given.');
  var configGlobalName = xdiv.dataset.config;
  var config = window[configGlobalName];
  var flForm = new FlForm(xdiv, config); // eslint-disable-line no-unused-vars
});