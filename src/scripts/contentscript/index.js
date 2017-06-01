'use strict';
// import ext from '../utils/ext';

import React from 'react';
import ReactDOM from 'react-dom';
import start from './startup';

import ext from '../utils/ext';
// config
import generalConfig from '../config/general';

import {select} from '../utils/helpers';

import Root from '../components/rootElement';

window.ln = window.ln || {};

window.ln.init = (() => {
  let init = function() {

    // Create a div where the exention will work in;
    start.init();

    //render the elemtn
    render();
  }

  let render = function() {

    const mainElement = select(`#${generalConfig.idName}`);

    //render the first element
    ReactDOM.render(
      <Root/>, mainElement);
  };

  return {init};

})();

window.ln.init.init();
