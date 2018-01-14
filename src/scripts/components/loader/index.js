'use strict';

/* Setup ==================================================================== */

// imports
import React, { Component } from 'react'; // eslint-disable-line no-unused-vars

/* Component ==================================================================== */
class Loader extends Component {
  static defaultProps = {
    color: 'blue', // the default collor > this is a part of a class that is defined in the scss loader.sccs
    loadingText: '',
  };

  /**
   * RENDER
   */
  render = () => {
    // the animation is done with css
    return (
      <div className={'ln-center'}>
        <div className={`ln-folding-cube ln-folding-cube-${this.props.color}`}>
          <div className="sk-cube1 sk-cube" />
          <div className="sk-cube2 sk-cube" />
          <div className="sk-cube4 sk-cube" />
        </div>
        <p>{this.props.loadingText}</p>
      </div>
    );
  };
}

/* Export Component ==================================================================== */
export default Loader;