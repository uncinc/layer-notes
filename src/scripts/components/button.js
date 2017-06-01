'use strict';

/* Setup ==================================================================== */
import React, {Component} from 'react';

/* Component ==================================================================== */
class Button extends Component {

  static defaultProps = {
    class: 'ln-btn-secondary', // the primary button
    text: '', // the text
    icon: null, //the icon. > you can chouse one form the ../../images/sprite his name will be a class
    title: '',
    onclick: () =>{}
  };

  constructor(props) {
    super(props);

  }
  /**
   * RENDER
   */
  _renderInnerButton = () => {
    if (this.props.icon !== null){
      return (
        <span className={`ln-icon ${this.props.icon}`}></span>
      );
    }else {
      return this.props.text;
    }
  }

  //render the page
  render = () => {
    return (
      <button className={`ln-btn ${this.props.class}`} title={this.props.title} onClick={this.props.onclick}>
        {this._renderInnerButton()}
      </button>
    );
  }
}

/* Export Component ==================================================================== */
export default Button;
