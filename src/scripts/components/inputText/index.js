'use strict';

/* Setup ==================================================================== */

//imports
import React, {Component} from 'react';

import validate from '../../utils/validate';
import {translate} from '../../utils/helpers';

/* Component ==================================================================== */
class Input extends Component {
  static defaultProps = {
    label: '',
    name: '',
    value: '',
    type: 'text',
    helperText: translate('inputTextHelperText'),
    placeholder: '',
    onchange: () => {}
  };

  constructor(props) {
    super(props);

    this.state = {
      isError: false, //if there is a error
      error: ''
    };
  }
  _renderError = () => {
    if (this.state.isError) { //rnder the error
      return (
        <span className={'ln-form-error'}>{this.state.error}</span>
      );
    } else {
      return '';
    }
  }
  _checkInput = (e) => {
    // this._validate(e);
    this.props.onchange(e);
  }

  _validate = (e) => { // validatg the input
    if (!validate[this.props.type](e.target.value)) {
      this.setState({isError: true, error: translate('inputTextError', this.props.type)});
    } else {
      this.setState({isError: false, error: ''});
    }
  }
  _renderLabel = () => { //render the label
    return (
      <label>{this.props.label}
        <div className="ln-input-helper">
          <span className="ln-icon ln-icon-info"></span>
          <span className="ln-input-helper--popup">{this.props.helperText}</span>
        </div>
      </label>
    );
  }
  /**
   * RENDER
   */
  render = () => {

    return (
      <div className="ln-setup--formelement">
        {this._renderLabel()}
        {this._renderError()}
        <input className={(this.state.isError)
          ? 'error'
          : ''} type={this.props.type}
          name={this.props.name}
          placeholder={this.props.placeholder}
          value={this.props.value}
          onChange={this._checkInput}
          onBlur={this._validate}></input>
      </div>
    );
  }
}

/* Export Component ==================================================================== */
export default Input;
