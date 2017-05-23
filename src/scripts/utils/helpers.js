'use-strict';

/* Component ==================================================================== */
const helpers = (() => {
  /**
   * Selects the element. and if querySelector is not defined it will return false.
   * @param   {Object}    the id or class from the html node you would like to get
   * @returns {Object}    A nodeList object from the HTML element.
   */
  var select = function (selector) {
      if (document.querySelector) {
        return document.querySelector(selector);
      } else {
        return false;
      }
    },
    /**
     * Selects the element with the id you have defined.
     * @param   {Object}    the id or class from the html node you would like to get
     * @returns {Object}    A nodeList object from the HTML element.
     */
    selectId = function (selector) {
      return document.getElementById(selector);
    },
    /**
     * Selects  the  all the elements. with the class and if querySelectorAll is not defined it will return false.
     * @param   {Object}    the class from the html node you would like to get
     * @returns {Object}    A nodeList object from the HTML element.
     */
    selectAll = function (selector) {
      if (document.querySelector) {
        return document.querySelectorAll(selector);
      } else {
        return false;
      }
    },
    /**
     * Sets a atribute to  a element
     * @param   {Object, String, String}  The HTML element, The atribute name, the value of the atribute
     */
    setAtribute = function (element, atr, value) {
      element.setAttribute(atr, value);
    },
    addClass = function (element, className) {
      if (!hasClass(element, className)) element.className += ' ' + className;
    },
    hasClass = function (element, className) {
      if (document.classList) {
        element.classList.add(className);
      } else {
        //suport for older browsers
        return element.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
      }
    },
    removeClass = function (element, className) {
      if (document.classList) {
        element.classList.add(className);
      } else {
        return false;
      }
    },
    /**
     * Delete a specific element based on the IDname
     * @param   {String} The id of the element;
     */
    deleteElement = function (idName) {
      var element = document.getElementById(idName);
      element.outerHTML = '';
    },
    setMinMaxWidth = function (newVal, minVal, maxVal) {
      // console.log('----------');
      // console.log('newVal', newVal);
      // console.log('minVal', minVal);
      // console.log('maxVal', maxVal);

      if (newVal < minVal) {
        // console.log('newVal < minVal', newVal < minVal);
        return minVal;
      } else if (newVal > maxVal) {
        // console.log('newVal > maxVal');
        return maxVal;
      } else if (newVal < maxVal && newVal > minVal) {
        // console.log('newVal < maxVal && newVal > minVal', newVal < maxVal && newVal > minVal);
        // console.log('newVal', newVal);
        return newVal;
      }
      // console.log('0', 0);
      // console.log('----------');
      return 0;
    },
    /**
     * Generate a UUID
     */
    generateUUID = function () { //egnerate a randmom UUID
      let d = new Date().getTime();

      let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
      return uuid;
    },
    /**
     * based on https://github.com/sindresorhus/pretty-bytes
     * Confert bytes to nice looking for humans
     * @param   {Number}    The bytes
     * @returns {String}    The conferted bytes
     */
    prettyBytes = (num) => {
      const UNITS = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      if (!Number.isFinite(num)) {
        throw new TypeError(`Expected a finite number, got ${typeof num}: ${num}`);
      }

      const neg = num < 0;

      if (neg) {
        num = -num;
      }

      if (num < 1) {
        return (neg ? '-' : '') + num + ' B';
      }

      const exponent = Math.min(Math.floor(Math.log(num) / Math.log(1000)), UNITS.length - 1);
      const numStr = Number((num / Math.pow(1000, exponent)).toPrecision(3));
      const unit = UNITS[exponent];

      return (neg ? '-' : '') + numStr + ' ' + unit;
    },

    /**
     * Creates a get XMLHttpRequest you can use it by   var _client = new DP.helper.GetData(),   _client.get('url', function(response) {})
     * @param   {String, String}    The url form the page you would like to get
     * @returns {Object}    The page content you would lik to get.
     */
    getData = function (url) {
      if (typeof Promise !== 'undefined' && Promise.toString().indexOf('[native code]') !== -1) {
        // return a Promise object
        return new Promise((resolve, reject) => {
          var request = new XMLHttpRequest();
          //open an get request
          request.open('GET', url);
          // request.onloadstart = function () {
          //
          // };
          // request.onloadend = function () {
          //
          // };

          //if the request is done
          request.onload = function () {
            //ony if request is done
            if (request.status === 200) {

              // send text form request
              resolve(request.responseText);
            } else {
              // reject the promise if there is a err
              reject(new Error('request failed!'));
            }
          };
          //send the request
          request.send();
        });
      } else {
        return false;
      }
    },
    cut = function (text, n) {
      var short = text.substr(0, n);
      if (/^\S/.test(text.substr(n))) {
        return short.replace(/\s+\S*$/, '');
      }
      return short;

    },
    clone = function (object) {
      return JSON.parse(JSON.stringify(object));
    },
    setNewState = (oldState, name, value) => {
      //clone the object;
      let newState = clone(oldState);
      newState[name] = value;

      return newState;
    },
    pageHeight = function () {
      var body = document.body,
        html = document.documentElement;

      return Math.max(body.scrollHeight, body.offsetHeight,
        html.clientHeight, html.scrollHeight, html.offsetHeight);
    },
    isPrommise = function (obj) {

      return (typeof obj.then === 'function')
      // return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
    };
  /**
   * Creates a POST XMLHttpRequest you can use it by    DP.helper.postData('path', 'params');
   * @param   {String, String}    The url op the page you would lik to post to, and the params you want to post
   * @returns {Object}            it will retun a error if somthing is wrong.
   */
  // postData = function (url, params) {
  //   return false;
  // };

  return {
    select,
    selectId,
    selectAll,
    setAtribute,
    addClass,
    removeClass,
    generateUUID,
    deleteElement,
    setMinMaxWidth,
    prettyBytes,
    getData,
    clone,
    cut,
    setNewState,
    pageHeight,
    isPrommise
    // postData
  };
})();

/* Export ==================================================================== */
module.exports = helpers;
module.exports.details = {
  title: 'helpers'
};
