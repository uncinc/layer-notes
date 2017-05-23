import ext from '../utils/ext';
import data from './data';

/* Component ==================================================================== */
const reseving = (() => {
  let init = function () {
    listen();
  };
  /**
   * Lissens to the messages send to the background script
   * @param   {String, Object} The message kind and the parrams
   * @returns {Bool} of a Error when there is something wrong
   */
  let listen = function () {
    ext.runtime.onMessage.addListener(function (request, sender, sendResponse) {
      //send the response in a data object
      let sendback = function (data) {
        sendResponse({
          data: data
        });
      };

      //send the error
      let sendErr = function (err) {
        sendResponse(err);
      };

      switch (request.type) {
      case 'rezize':
        rezize(request.params);
        break;
      case 'open':
        open(request.params);
        break;
      case 'checkLogin': //check the user params
        data.checkLogin(request.params).then(sendback).catch(sendErr);
        break;
      case 'getTicketsFromPage':
        data.getTicketsFromPage(request.params).then(sendback).catch(sendErr);
        break;
      case 'submitNewTicket':
        data.submitNewTicket(request.params).then(sendback).catch(sendErr);
        break;
      case 'updateTicket':
        data.updateTicket(request.params).then(sendback).catch(sendErr);
        break;
      case 'isFirstTime':
        data.isFirstTime(request.params).then(sendback).catch(sendErr);
        break;
      case 'setSite':
        data.setSite(request.params).then(sendback).catch(sendErr);
        break;
      case 'getStorage':
        data.getStorage(request.params).then(sendback).catch(sendErr);
        break;
      case 'takeScreenschot':
        data.takeScreenschot(request.params).then(sendback).catch(sendErr);
        break;
      default:
        //the message type is unknown
        console.warn('>--------: A unknown type resived');
      }

      //Return true so the async function can be resoleved and the message will be resieved by the content script
      return true;
    });
  };

  /**
   * Rezise the screen to the params width and height
   * @param   {Object} A object with a with and height in px
   */
  let rezize = function (params) {
    ext.windows.getCurrent(function (wind) {
      ext.windows.update(wind.id, params);
    });
  };

  /**
   * Opens a page in a new tab
   * @param   {Object} A object with a url
   */
  let open = function (params) {
    ext.windows.create({
      url: params.url
    });
  };

  return {
    init
  };

})();

/* Export ==================================================================== */
module.exports = reseving;
module.exports.details = {
  title: 'reseving-messages'
};
