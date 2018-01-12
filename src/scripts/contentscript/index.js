'use strict';

// import ext from '../utils/ext';

import React from 'react';
import ReactDOM from 'react-dom';
import start from './startup';


// config
import generalConfig from '../config/general';

import { select } from '../utils/helpers';

import Root from '../components/rootElement';

window.ln = window.ln || {};

window.ln.init = (() => {
  const render = () => {
    const mainElement = select(`#${generalConfig.idName}`);
    // render the first element
    ReactDOM.render(<Root />, mainElement);
  };

  const init = () => {
    // Create a div where the exention will work in;
    start.init();

    // render the elemtn
    render();
  };

  return { init };
})();

window.ln.init.init();