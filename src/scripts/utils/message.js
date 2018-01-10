'use strict';

import ext from '../utils/ext';

const message = (() => {

  /**
   * Send a message to the background script
   * @param   {String, Object}  The first one is the type of the message.
   *                            You can find the types in ../background/reseving.js.
   *                            The second paramameter is a object.
   * @returns {Object} This contains the data that form te data base or true
   *                  or false when there was only a browser call
   */

  const send = (type, params) => {
    return new Promise((resolve, reject) => {
      try {
        ext.runtime.sendMessage({
          type, // See for types file ../background/reseving.js.
          params, // is a object
        }, (data) => {
          if (data.status === undefined) { // When tere is a status given its a error.
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
    send,
  };
})();

/* Export ==================================================================== */
module.exports = message;
module.exports.details = {
  title: 'sending-messages',
};