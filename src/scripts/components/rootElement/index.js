'use strict';

/* Setup ==================================================================== */

import React, {Component} from 'react'; // eslint-disable-line no-unused-vars

//import helpers
import helpers from '../../utils/helpers';

// Components
import Router from '../router'; // eslint-disable-line no-unused-vars

/* Component ==================================================================== */
class Root extends Component {

  constructor(props) {
    super(props);

    this.state = { // the inner windowwidth
      width: window.innerWidth,
      height: helpers.pageHeight()
    };
  }

  componentDidMount() {
    //watch on the window rezise
    window.addEventListener('resize', this._watchResizeOfPage);
  }

  //remove the event lisner
  componentWillUnmount() {
    window.removeEventListener('resize', this._watchResizeOfPage);
  }

  _watchResizeOfPage = (e) => {
    //set the width and the height
    this.setState({width: e.target.innerWidth, height: helpers.pageHeight()});
  }

  //set the .ln-root element over the whole page; So it has cross site support
  render = () => {
    return (
      <div className="ln-root" style={{
        width: this.state.width,
        height: this.state.height
      }}>
        <Router/>
      </div>
    );
  }
}

/* Export Component ==================================================================== */
export default Root;
