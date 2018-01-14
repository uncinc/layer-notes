'use strict';

import generalConfig from '../config/general';
import { select } from '../utils/helpers';

/* Component ==================================================================== */
let start = (() => {
  let init = function() {
    createBaseElement();
  };

  let createBaseElement = function() {
    //only create element if element does not exist;
    if (!checkExistingElement()) {
      //create element
      let toolPlugin = document.createElement(generalConfig.mainElement);
      toolPlugin.id = generalConfig.idName;

      //append the created element to body;
      document.body.appendChild(toolPlugin);
    }
  };

  let checkExistingElement = function() {
    return select(`#${generalConfig.idName}`) ? true : false;
  };

  return {
    init
  };
})();

/* Export  ==================================================================== */
export default start;