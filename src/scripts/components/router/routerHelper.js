'use-strict';

// import ext from '../utils/ext';
import storage from '../../utils/storage';

/* Component ==================================================================== */
const routerHelper = (() => {
  // change the state of the app
  const setStateApp = (state) => {
    storage.set({
      lnState: state,
    });
  };

  return {
    setStateApp,
  };
})();

/* Export ==================================================================== */
export default routerHelper;