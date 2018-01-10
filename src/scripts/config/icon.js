'use strict';

import ext from '../utils/ext';

// config
import generalConfig from '../config/general';

// helpers
import helpers, { translate } from '../utils/helpers';

/* Component ==================================================================== */
const iconConfig = (() => {
  let opendTabNumer = null;
  const settings = {
    defaultState: 'off',
    on: {
      icon: '/icons/icon-128.png',
      // badgeText  : 'On',
      // badgeColor : 'green',
      title: translate('toolOff'),
      action: (tab) => {
        stopApp(tab);
      },
      nextState: 'off',
    },
    off: {
      icon: '/icons/icon_black-128.png',
      // badgeText  : 'Off',
      // badgeColor : 'red',
      title: translate('toolOn'),
      action: (tab) => {
        // check if the tab is a http of https site
        // When it isn't sutch site do not inject;
        if (helpers.isURL(tab.url)) {
          if (opendTabNumer === null) {
            opendTabNumer = tab.id;
          }

          ext.webNavigation.onCompleted.addListener(
            scrirptListener.bind(this, tab)
          );

          injectSripts(tab);

          console.log('The exention is turned on');
        }
      },
      nextState: 'on'
    }
  };

  function scrirptListener(tab) {
    injectSripts(tab);
  }

  function injectSripts(tab) {
    if (tab.id === opendTabNumer) {
      // insert js;
      ext.tabs.executeScript(tab.id, {
        file: 'scripts/contentscript/index.js'
        // frameId: tab.id
        //
        //     "run_at": "document_start",
        // "all_frames": true
      });

      // insert css;
      ext.tabs.insertCSS(tab.id, {
        file: 'styles/index.css',
        // cssOrigin: 'user'
      });
    } else {
      console.log(`>---------: The scirpt is already injected in tab ${opendTabNumer} and this is tab ${tab.id}`);
    }
  }

  // Retrun a error
  function onError(error) {
    console.log(`Error: ${error}`);
  }

  /**
   * Stops the app by injecting code inin the website
   */
  function stopApp(tab) {
    // script to delte the element;
    const clearMainElement = `var lnMainElement = document.getElementById("${generalConfig.idName}"); (lnMainElement) ? lnMainElement.outerHTML = "" : null;`;
    ext.tabs.executeScript({
      code: clearMainElement,
    });

    ext.webNavigation.onCompleted.removeListener(scrirptListener);

    // check if ext.tabs.removeCSS is supported because Chrome does not support it.
    if (ext.tabs.removeCSS) {
      const removingCSS = ext.tabs.removeCSS(tab.id, {
        file: 'styles/index.css',
      });

      // when the css is removeed
      removingCSS.then(() => {
        opendTabNumer = null;
      }, onError);
    } else {
      opendTabNumer = null;
    }
  }
  return settings;
})();

/* Export  ==================================================================== */

export default iconConfig;