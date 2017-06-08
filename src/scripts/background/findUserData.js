'use strict';
// config
// import generalConfig from '../config/general';
import browserConfig from 'bowser';
// import ext from '../utils/ext';

/* Component ==================================================================== */
var data = (() => {

  /**
   * Get user data from the browser for adding it to mantis;
   * @returns {Object} of of the browser data
   */
  let browserData = () => {
    return { //find all the borser data
      browserName: browserConfig.name.toLowerCase(),
      browserVersion: browserConfig.version,
      osversion: browserConfig.osversion,
      user_agent: window.navigator.appVersion,
      os: getOs()
    };
  };

  function getOs() {
    if (browserConfig.mac) {
      return 'mac';
    } else if (browserConfig.windows) {
      return 'windows';
    } else if (browserConfig.windowsphone) {
      return 'windowsphone';
    } else if (browserConfig.linux) {
      return 'linux';
    } else if (browserConfig.chromeos) {
      return 'chromeos';
    } else if (browserConfig.android) {
      return 'android';
    } else if (browserConfig.ios) {
      return 'ios';
    } else if (browserConfig.blackberry) {
      return 'blackberry';
    } else if (browserConfig.firefoxos) {
      return 'firefoxos';
    } else if (browserConfig.webos) {
      return 'webos';
    } else if (browserConfig.bada) {
      return 'bada';
    } else if (browserConfig.tizen) {
      return 'tizen';
    } else if (browserConfig.sailfish) {
      return 'sailfish';
    }
    return false;
  }

  /**
   * Get specific user data
   * @returns {Object} of of the browser data
   */
  let specificUserData = (hostname, url, shortlink, screenresolution) => {
    let userData = {
      browserData: browserData(),
      language: window.navigator.language,
      // savedCookies: document.cookie,
      url: url,
      shortlink: shortlink,
      hostname: hostname,
      time: new Date(),
      screenresolution: screenresolution
      // history: getHistory()
    };

    // window.onerror = function (msg, url, lineNo, columnNo, error) {
    //     var string = msg.toLowerCase();
    //     var substring = "script error";
    //     if (string.indexOf(substring) > -1){
    //         alert('Script Error: See Browser Console for Detail');
    //     } else {
    //         var message = [
    //             'Message: ' + msg,
    //             'URL: ' + url,
    //             'Line: ' + lineNo,
    //             'Column: ' + columnNo,
    //             'Error object: ' + JSON.stringify(error)
    //         ].join(' - ');
    //
    //         alert(message);
    //     }
    //
    //     return false;
    // };

    // // console.log(ext.tabs);
    // var gettingZoomSettings = ext.tabs.getZoomSettings();
    // console.log('gettingZoomSettings', gettingZoomSettings);
    // gettingZoomSettings.then(function (data) {
    //   console.log(data);
    // }, function (err) {
    //   console.log('hiohiohi',err);
    // });


    // function gotVisits(visits) {
    //   console.log("Visit count: " + visits.length);
    //   for (visit of visits) {
    //     console.log(visit.visitTime);
    //   }
    // }
    //
    // function listVisits(historyItems) {
    //   if (historyItems.length) {
    //     console.log("URL " + historyItems[0].url);
    //     var gettingVisits = ext.history.getVisits({
    //       url: historyItems[0].url
    //     });
    //     gettingVisits.then(gotVisits);
    //   }
    // }
    //
    // var searching = ext.history.search({
    //   text: "",
    //   startTime: 0,
    //   maxResults: 1
    // });
    //
    // console.log(searching);
    // searching.then(listVisits);


    // Zoom level
    // Screenschot
    // console errors (als mogelijk)
    // Autenticatie (ingelogd of niet) (als mogelijk)
    // Input words (post / get) (als mogelijk)
    // Cookies/Local storage
    // Browser plugins (add blocker) (als mogelijk)
    // Laatste 4 urls


    // console.log(ext.tabs);
    return userData;
  };

  // let getHistory = () => {
  //   return ['https://hio.nl', 'https://todo.nl'];
  // };

  return {
    specificUserData
  };

})();

export default data;
