/**
 * Global App Config
 */

import { pageHeight } from '../utils/helpers';

/* Setup ==================================================================== */
exports.title = 'GlobalConfig';

/* Export ==================================================================== */

export default {
  // App Details
  appName: 'Layer Notes', // the tool name
  idName: 'layernotes', // the id of the element
  mainElement: 'div', // the main element that is the first element where all data in
  minX: 0,
  minY: 0,
  maxX: (width) => {
    return window.innerWidth - width;
  },
  maxY: (height) => {
    return pageHeight() - height;
  },
  url: window.location.href,
  shortlink:
    document.head.querySelector('[rel=shortlink]') !== null
      ? document.head.querySelector('[rel=shortlink]').getAttribute('href')
      : null,
  hostname:
    window.location.hostname !== null || window.location.hostname !== undefined
      ? window.location.hostname
      : 'localhost',
  minHeight: 80,
  minWidth: 100,
  maxLetters: 100,
};