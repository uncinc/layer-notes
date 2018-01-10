'use strict';

// start the whole app
import toggleIcon from './toggle-icon';
import reseving from './reseving';
import data from './data';

// set the icon listner so the exention can be turned on and of
toggleIcon.init();

// set up the reseving of the messages
reseving.init();

// init the data (so create data objects)
data.init();