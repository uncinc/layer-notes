'use strict';

/* Setup ==================================================================== */

//imports
import React, {Component} from 'react';
import Anime from 'react-anime';

//tools
import ext from '../../utils/ext';

//Components
import Router from '../router/router';

//helper
import routerHelper from '../router/routerHelper';
import {translate} from '../../utils/helpers';

/* Component ==================================================================== */
class ToolBar extends Component {
  static defaultProps = {
    total: 0,
    filtertTotal: 0
  };

  constructor(props) {
    super(props);

    this.state = {
      styles: {},
      translateX: '-7em',
      buttons: [
        {
          iconClass: 'ln-icon ln-icon-layernotes-white', //THis is the class that represents the icon
          text: translate('toolBarNewNoteText'), // the button title
          title: translate('toolBarNewNoteTitle'), // the title hover. So the user will get a hint
          class: 'ln-new', //The class of the elemnt so i'm be able to select it
          funcVal: 'startIssue', //The path of the page
          func: () => {} // the funciton that also should fire.
        }, {
          iconClass: 'ln-icon ln-icon-settings',
          text: translate('toolBarSettingsText'),
          title: translate('toolBarSettingsTitle'),
          class: 'ln-settings',
          funcVal: 'settings',
          func: this._openSettingsPage
        }
      ]
    };
  }

  //Open a new window to go to the settings page of the tool;
  _openSettingsPage = () => {
    console.log('Go to settings');
    ext.tabs.create({"url": "/options.html"});
  }

  //render the buttons in the toolbar
  _renderButtons = () => {
    //loop true the array and return a button with the right icon and function
    return this.state.buttons.map((button, index) => {
      return (
        <button key={index} onClick={() => {
          routerHelper.setStateApp(button.funcVal), button.func()
        }} className="ln-toolbar-btn ln-btn" title={button.title}>
          <span className={button.iconClass}></span>
          <span className={'ln-toolbar--text'}>{button.text}</span>
        </button>
      );
    });
  }

  /**
   * RENDER
   */
  render = () => {

    //translateY={['-50%', '-50%']} do not translateY;
    return (
      <Anime delay={(e, i) => i * 10} duration={500} translateX={this.state.translateX} translateY={['-50%', '-50%']} easing={'easeOutBack'}>
        <section className={'ln-toolbar elasticity-100'}>
          {this._renderButtons()}
          <span className="ln-toolbar-amouttickets" title={translate('toolBarAmoutTicketsTitle')}>{this.props.filtertTotal}/{this.props.total}</span>
        </section>
      </Anime>
    );
  }
};

/* Export Component ==================================================================== */
export default ToolBar
