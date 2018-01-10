import ext from '../utils/ext';
import data from './data';

/* Component ==================================================================== */
const reseving = (() => {
  /**
   * Lissens to the messages send to the background script
   * @param   {String, Object} The message kind and the parrams
   * @returns {Bool} of a Error when there is something wrong
   */
  const listen = () => {
    ext.runtime.onMessage.addListener((request, sender, sendResponse) => {

      // send the response in a data object
      const sendback = (data) => {
        sendResponse({
          data,
        });
      };

      // send the error
      const sendErr = (err) => {
        sendResponse(err);
      };

      switch (request.type) {
        case 'rezize':
          rezize(request.params);
          break;
        case 'open':
          open(request.params);
          break;
        case 'checkLogin': // check the user params
          data
            .checkLogin(request.params)
            .then(sendback)
            .catch(sendErr);
          break;
        case 'getTicketsFromPage':
          data
            .getTicketsFromPage(request.params)
            .then(sendback)
            .catch(sendErr);
          break;
        case 'submitNewTicket':
          data
            .submitNewTicket(request.params)
            .then(sendback)
            .catch(sendErr);
          break;
        case 'updateTicket':
          data
            .updateTicket(request.params)
            .then(sendback)
            .catch(sendErr);
          break;
        case 'isFirstTime':
          data
            .isFirstTime(request.params)
            .then(sendback)
            .catch(sendErr);
          break;
        case 'setSite':
          data
            .setSite(request.params)
            .then(sendback)
            .catch(sendErr);
          break;
        case 'getStorage':
          data
            .getStorage(request.params)
            .then(sendback)
            .catch(sendErr);
          break;
        case 'takeScreenschot':
          data
            .takeScreenschot(request.params)
            .then(sendback)
            .catch(sendErr);
          break;
        case 'getUrls':
          data
            .getUrls(request.params)
            .then(sendback)
            .catch(sendErr);
          break;
        default:
          // the message type is unknown
          console.warn('>--------: A unknown type resived');
      }

      // Return true so the async function can be resoleved and
      // the message will be resieved by the content script
      return true;
    });
  };

  /**
   * Rezise the screen to the params width and height
   * @param   {Object} A object with a with and height in px
   */
  let rezize = (params) => {
    ext.windows.getCurrent((wind) => {
      // only resize when the screen is not the same size. Anothers the app will glitsh
      if (wind.width !== params.width) {
        ext.windows.update(wind.id, {
          width: params.width,
        });
      }

      // only resize when the screen is not the same size. Anothers the app will glitsh
      if (wind.height !== params.height) {
        ext.windows.update(wind.id, {
          height: params.height,
        });
      }
    });
  };

  /**
   * Opens a page in a new tab
   * @param   {Object} A object with a url
   */
  let open = (params) => {
    ext.windows.create({
      url: params.url,
    });
  };

  const init = () => {
    listen();
  };

  return {
    init,
  };
})();

/* Export ==================================================================== */
module.exports = reseving;
module.exports.details = {
  title: 'reseving-messages'
};