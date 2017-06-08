'use strict';

const apis = [
  'alarms',
  'bookmarks',
  'browserAction',
  'commands',
  'contextMenus',
  'cookies',
  'downloads',
  'events',
  'extension',
  'extensionTypes',
  'history',
  'i18n',
  'idle',
  'notifications',
  'pageAction',
  'runtime',
  'storage',
  'tabs',
  'webNavigation',
  'webRequest',
  'windows'
];

function Extension() {
  const _this = this;

  apis.forEach(function (api) {

    _this[api] = null;

    try {
      if (chrome[api]) {
        _this[api] = chrome[api];
      }
    } catch (e) {
      console.log('NOTFOUND_ERR:', e);
    }

    try {
      if (window[api]) {
        _this[api] = window[api];
      }
    } catch (e) {
      console.log('NOTFOUND_ERR:', e);
    }

    try {
      if (browser[api]) {
        _this[api] = browser[api];
      }
    } catch (e) {
      console.log('NOTFOUND_ERR:', e);
    }
    try {
      _this.api = browser.extension[api];
    } catch (e) {
      console.log('NOTFOUND_ERR:', e);
    }
  });

  try {
    if (browser && browser.runtime) {
      this.runtime = browser.runtime;
    }
  } catch (e) {
    console.log('NOTFOUND_ERR:', e);
  }

  try {
    if (browser && browser.browserAction) {
      this.browserAction = browser.browserAction;
    }
  } catch (e) {
    console.log('NOTFOUND_ERR:', e);
  }
}

/* Export  ==================================================================== */
module.exports = new Extension();
