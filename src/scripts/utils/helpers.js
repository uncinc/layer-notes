'use-strict';

import ext from './ext';
import scrollIt from './scrollit';
import generalData from '../config/general';
import anime from 'animejs';

/* Component ==================================================================== */
const helpers = (() => {
  /**
   * Selects the element. and if querySelector is not defined it will return false.
   * @param   {Object}    the id or class from the html node you would like to get
   * @returns {Object}    A nodeList object from the HTML element.
   */
  const select = selector => {
    if (document.querySelector) {
      return document.querySelector(selector);
    }
    return false;
  };

  /**
   * Selects the element with the id you have defined.
   * @param   {Object}    the id or class from the html node you would like to get
   * @returns {Object}    A nodeList object from the HTML element.
   */
  const selectId = selector => {
    return document.getElementById(selector);
  };

  const log = (prio, message, message2) => {
    const { env } = ext.runtime.getManifest();

    if (env === 'dev') {
      if (prio === 'info') {
        console.info(message, message2);
      } else if (prio === 'error') {
        console.error(message, message2);
      }
    }
  };

  /**
   * Selects  the  all the elements. with the class and
   * if querySelectorAll is not defined it will return false.
   * @param   {Object}    the class from the html node you would like to get
   * @returns {Object}    A nodeList object from the HTML element.
   */
  const selectAll = selector => {
    if (document.querySelector) {
      return document.querySelectorAll(selector);
    }
    return false;
  };
  /**
   * Sets a atribute to  a element
   * @param   {Object, String, String}  The HTML element, The atribute name,
   *                                    the value of the atribute
   */
  const setAtribute = (element, atr, value) => {
    element.setAttribute(atr, value);
  };

  const addClass = (element, className) => {
    if (document.classList) {
      element.classList.add(className);
    } else if (!hasClass(element, className)) {
      element.className += ` ${className}`;
    }
  };

  const hasClass = (element, className) => {
    // suport for older browsers
    return element.className.match(
      new RegExp('(\\s|^)' + className + '(\\s|$)')
    );
  };
  const removeClass = (element, className) => {
    if (document.classList) {
      element.classList.add(className);
    }
    return false;
  };
  /**
   * Delete a specific element based on the IDname
   * @param   {String} The id of the element;
   */
  const deleteElement = idName => {
    const element = document.getElementById(idName);
    element.outerHTML = '';
  };

  const setMinMaxWidth = (newVal, minVal, maxVal) => {
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
  };
  /**
   * Generate a UUID
   */
  const generateUUID = () => {
    // generate a randmom UUID
    const RANDNUMBER = 16;
    let d = new Date().getTime();

    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = ((d + Math.random() * RANDNUMBER) % RANDNUMBER) | 0;
      d = Math.floor(d / RANDNUMBER);
      return (c == 'x' ? r : (r & 0x3) | 0x8).toString(RANDNUMBER);
    });
    return uuid;
  };
  /**
   * based on https://github.com/sindresorhus/pretty-bytes
   * Confert bytes to nice looking for humans
   * @param   {Number}    The bytes
   * @returns {String}    The conferted bytes
   */
  const prettyBytes = num => {
    const UNITS = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    if (!Number.isFinite(num)) {
      throw new TypeError(
        `Expected a finite number, got ${typeof num}: ${num}`
      );
    }

    const neg = num < 0;

    if (neg) {
      num = -num;
    }

    if (num < 1) {
      return (neg ? '-' : '') + num + ' B';
    }

    const exponent = Math.min(
      Math.floor(Math.log(num) / Math.log(1000)),
      UNITS.length - 1
    );
    const numStr = Number((num / Math.pow(1000, exponent)).toPrecision(3));
    const unit = UNITS[exponent];

    return (neg ? '-' : '') + numStr + ' ' + unit;
  };

  /**
   * Creates a get XMLHttpRequest you can use it by
   * var _client = new DP.helper.GetData(),   _client.get('url', function(response) {})
   * @param   {String, String}    The url form the page you would like to get
   * @returns {Object}    The page content you would lik to get.
   */
  const getData = url => {
    if (
      typeof Promise !== 'undefined' &&
      Promise.toString().indexOf('[native code]') !== -1
    ) {
      // return a Promise object
      return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        // open an get request
        request.open('GET', url);
        // request.onloadstart = function () {
        //
        // };
        // request.onloadend = function () {
        //
        // };

        // if the request is done
        request.onload = () => {
          // ony if request is done
          if (request.status === 200) {
            // send text form request
            resolve(request.responseText);
          } else {
            // reject the promise if there is a err
            reject(new Error('request failed!'));
          }
        };
        // send the request
        request.send();
      });
    }
    return false;
  };
  const cut = (text, n) => {
    var short = text.substr(0, n);
    if (/^\S/.test(text.substr(n))) {
      return short.replace(/\s+\S*$/, '');
    }
    return short;
  };

  const clone = object => {
    return JSON.parse(JSON.stringify(object));
  };

  const setNewState = (oldState, name, value) => {
    // clone the object;
    const newState = clone(oldState);
    newState[name] = value;

    return newState;
  };
  const pageHeight = () => {
    const { body } = document;
    const html = document.documentElement;

    return Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
  };

  const isPrommise = obj => {
    return typeof obj.then === 'function';
    // return !!obj && (typeof obj === 'object' || typeof obj === 'function')
    //  && typeof obj.then === 'function';
  };
  const shortText = text => {
    if (text.length > generalData.maxLetters) {
      return (
        cut(
          text.replace(
            '/(issues)|(thes)|(sites)|(websites)|(ins)|(ons)|(pages)|(tos)/g',
            ''
          ),
          generalData.maxLetters
        ) + '...'
      );
    }

    return text;
  };

  function generateReadableContentFromObject(object = {}) {
    let readableString = '';

    Object.keys(object).map((key) => {
      let value = object[key];
      if (typeof value === 'object') {
        value = JSON.stringify(object[key]);
      }
      readableString += `${key}: ${value} \n`;
    });

    return readableString;
  }

  const isURL = (str) => {
    const pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
      'i',
    ); // fragment locator

    return pattern.test(str);
  };

  const translate = (message, value) => {
    return ext.i18n.getMessage(message, value);
  };

  function scrollTo(left, top) {
    const scrollPositions = {
      top: document.body.scrollTop,
      left: document.body.scrollLeft
    };

    anime({
      targets: scrollPositions,
      top,
      left,
      duration: 500,
      easing: 'easeInCubic',
      round: 1,
      update: () => {
        scrollIt(top);
      },
    });
  };

  function inverse(num) {
    return num - (num * 2);
  }

  return {
    select,
    selectId,
    selectAll,
    log,
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
    isPrommise,
    shortText,
    generateReadableContentFromObject,
    isURL,
    translate,
    scrollTo,
    inverse,
  };
})();

/* Export ==================================================================== */
module.exports = helpers;
module.exports.details = {
  title: 'helpers'
};