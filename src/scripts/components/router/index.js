'use strict';

/* Setup ==================================================================== */
/*eslint-disable no-unused-vars*/
import React, {Component} from 'react';
import Tour from '../../components/userTour';

import ext from '../../utils/ext';

// Components
import ToolBar from '../toolbar';
import Selector from '../selector';
import Setup from '../setup';
import TicketsOnPage from '../ticketsOnPage';
/*eslint-disable no-unused-vars*/

//data
import tourSteps from '../../config/tourSteps';

//helpers
import generalData from '../../config/general';
import message from '../../utils/message.js';
import routerHelper from './routerHelper';

/* Component ==================================================================== */
class Router extends Component {

  constructor(props) {
    super(props);

    this.state = {
      lnState: 'home', //the default state of the app.

      //Tour vars;
      steps: tourSteps, //This are the steps of the tour;
      isTourActive: false, //This is on true when the user clicks on start tour in the setup
      tourStep: 1 //set to the first step;
    };
  }

  componentDidMount() {
    let _this = this;

    //watch the state of the app
    this._watchStateApp();

    //send a messate to the background scritpt to check if this is the first ticket on this site or not
    message.send('isFirstTime', {hostname: generalData.hostname}).then(function(isFirstTime) {
      //if its the rist time
      if (!isFirstTime.data) { //this is becouse the some funciton always returns true when something is found
        console.log('>--------: This is the first time the app starts on this page');

        routerHelper.setStateApp('setup');
        _this.setState({lnState: 'setup'}); //It could be on Webkit browsers that the _watchStateApp is not fired before this function. So always set the state from the app;

      } else {
        console.log('>--------: The app is already started on this page before');
        routerHelper.setStateApp('home');
        _this.setState({lnState: 'home'}); //It could be on Webkit browsers that the _watchStateApp is not fired before this function. So always set the state from the app;
      }
    });
  }

  _watchStateApp = () => {
    let _this = this;

    //add a listner to the change of the localstorge
    ext.storage.onChanged.addListener(function(changes) {
      //only change the state when the lnState is changed
      if (changes.lnState) {
        //set the new state so react will reredner the page;
        _this.setState({lnState: changes.lnState.newValue});
      }
    });
  };

  //this is for the tour
  _onNextStep = (step) => {
    this.setState({tourStep: step});
  }
  _onBackStep = (step) => {
    this.setState({tourStep: step});
  }
  _onCancel = () => {
    this.setState({isTourActive: false});
  }

  /**
   *set the tour var when the user has clicked on the start tour button in the setup
   * @param   {BOOL} if the tour should start
   */
  _setTour = (tourStart) => {
    if (tourStart) {
      this.setState({isTourActive: true});
    }
    routerHelper.setStateApp('home');
  }

  //render the right part
  _stateRoutingLogic = () => {
    console.info(`>--------: Navigate to the ${this.state.lnState} page`);
    if (this.state.lnState === 'home') {
      return (
        <div>
          <TicketsOnPage/>
          <Tour active={this.state.isTourActive} step={this.state.tourStep} onNext={this._onNextStep} onBack={this._onBackStep} onCancel={this._onCancel} steps={this.state.steps}/>
        </div>
      );
    } else if (this.state.lnState === 'startIssue') {
      return (
        <div>
          <Selector/>
          <Tour active={this.state.isTourActive} step={this.state.tourStep} onNext={this._onNextStep} onBack={this._onBackStep} onCancel={this._onCancel} steps={this.state.steps}/>
        </div>
      );
    } else if (this.state.lnState === 'setup') {
      return (<Setup onFinish={this._setTour}/>);
    } else if (this.state.lnState === 'settings') {
      return (<ToolBar/>);
    }
  };

  //render the router
  render = () => {
    return (
      <div>
        {this._stateRoutingLogic()}
      </div>
    );
  }
}

//* Export Component ==================================================================== */
export default Router;
