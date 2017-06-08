'use strict';

import ext from '../utils/ext';

const message = (() => {

  /**
   * Send a message to the background script
   * @param   {String, Object}  The first one is the type of the message. You can find the types in ../background/reseving.js. The second paramameter is a object.
   * @returns {Object} This contains the data that form te data base or true or false when there was only a browser call
   */
  let send = function (type, params) {

    return new Promise(function (resolve, reject) {
      try {
        ext.runtime.sendMessage({
          type: type, // see for types file ../background/reseving.js.
          params: params // is a object
        }, function (data) {
          if (data.status === undefined) { //When tere is a status given its a error.
            resolve(data);
          } else {
            reject(data);
          }
        });
      } catch (err) {
        console.error(`>-------------------: Error ${err.message}`, err);
        reject(err);
      }
    });
  };

  return {
    send
  };
})();

/* Export ==================================================================== */
module.exports = message;
module.exports.details = {
  title: 'sending-messages'
};
