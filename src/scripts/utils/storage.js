'use strict';

import ext from './ext';

/* Export  ==================================================================== */

module.exports = (ext.storage.sync ? ext.storage.sync : ext.storage.local);