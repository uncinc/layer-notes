'use strict';
import iconConfig from '../config/icon';
import ext from '../utils/ext';

//this code is modified from http://stackoverflow.com/questions/40603655/in-a-firefox-webextension-how-i-can-make-a-button-that-looks-and-acts-like-a-to#40604386

//The iconConfig Object describes the states the button can be in and the
//  'action' function to be called when the button is clicked when in that state.
//  In this case, we have two states 'on' and 'off'.
//  You could expand this to as many states as you desire.
//icon is a string, or details Object for browserAction.setIcon()
//title must be unique for each state. It is used to track the state.
//  It indicates to the user what will happen when the button is clicked.
//  In other words, it reflects what the _next_ state is, from the user's
//  perspective.
//action is the function to call when the button is clicked in this state.

//This moves the Browser Action button between states and executes the action
//  when the button is clicked. With two states, this toggles between them.

let toggleIcon = (() => {
  let init = function () {
    //Set the starting button state to the default state
    setBrowserActionButton(iconConfig[iconConfig.defaultState]);
    startWatchingOnClick();
  };

  let startWatchingOnClick = function () {
    ext.browserAction.onClicked.addListener(function (tab) {
      ext.browserAction.getTitle({
        tabId: tab.id
      }, function (title) {
        //After checking for errors, the title is used to determine
        //  if this is going to turn On, or Off.
        if (ext.runtime.lastError) {
          console.log('browserAction:getTitle: Encountered an error: ' + ext.runtime.lastError);
          return;
        }
        //Check to see if the current button title matches a button state
        let newState = iconConfig.defaultState;
        Object.keys(iconConfig).some(key => {
          if (key === 'defaultState') {
            return false;
          }
          let state = iconConfig[key];
          if (title === state.title) {
            newState = state.nextState;
            setBrowserActionButton(iconConfig[newState]);
            if (typeof state.action === 'function') {
              //Do the action of the matching state
              state.action(tab);
            }
            //Stop looking
            return true;
          }
        });
        setBrowserActionButton(iconConfig[newState]);
      });
    });
  };

  let setBrowserActionButton = function (tabId, details) {
    if (typeof tabId === 'object' && tabId !== null) {
      //If the tabId parameter is an object, then no tabId was passed.
      details = tabId;
      tabId = null;
    }
    let {
      icon,
      title,
      text,
      color
    } = details;

    //Supplying a tabId is optional. If not provided, changes are to all tabs.
    let tabIdObject = {};
    if (tabId !== null && typeof tabId !== 'undefined') {
      tabIdObject.tabId = tabId;
    }
    if (typeof icon === 'string') {
      //Assume a string is the path to a file
      //  If not a string, then it needs to be a full Object as is to be passed to
      //  setIcon().
      icon = {
        path: icon
      };
    }
    if (icon) {
      Object.assign(icon, tabIdObject);
      ext.browserAction.setIcon(icon);
    }
    if (title) {
      let detailsObject = {
        title
      };
      Object.assign(detailsObject, tabIdObject);
      ext.browserAction.setTitle(detailsObject);
    }
    if (text) {
      let detailsObject = {
        text
      };
      Object.assign(detailsObject, tabIdObject);
      ext.browserAction.setBadgeText(detailsObject);
    }
    if (color) {
      let detailsObject = {
        color
      };
      Object.assign(detailsObject, tabIdObject);
      ext.browserAction.setBadgeBackgroundColor(detailsObject);
    }
  };

  return {
    init
  };

})();

/* Export Component ==================================================================== */
export default toggleIcon;
