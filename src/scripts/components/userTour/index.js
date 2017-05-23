//Modified from https://github.com/socialtables/react-user-tour

import React, {Component} from "react";
import Anime from 'react-anime';

import Button from '../button';
import positions from './helpers/position-helpers';
import * as viewBoxHelpers from './helpers/viewbox-helpers';
import scrollToPosition from './helpers/scroll-to-position';

/* Component ==================================================================== */
export default class ReactUserTour extends Component {

  constructor(props) {
    super(props);
    this.prevPos = {
      top: 0,
      left: 0
    };
    this.getStepPosition = this.getStepPosition.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return this.props.step !== nextProps.step || this.props.active !== nextProps.active;
  }

  getStepPosition(selector, tourElWidth, tourElHeight, overridePos, margin = 15) {
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;
    const el = document.querySelector(selector);
    if (el) {
      let position = el
        ? el.getBoundingClientRect()
        : {};
      const isElementBelowViewBox = viewBoxHelpers.isElementBelowViewBox(windowHeight, position.top);
      const isElementAboveViewBox = viewBoxHelpers.isElementBelowViewBox(position.bottom);
      if (isElementBelowViewBox) {
        position = scrollToPosition(el, position.bottom);
      } else if (isElementAboveViewBox) {
        position = scrollToPosition(el, window.pageYOffset + position.top);
      }
      const shouldPositionLeft = viewBoxHelpers.shouldPositionLeft(windowWidth, position.left);
      const shouldPositionAbove = viewBoxHelpers.shouldPositionAbove(windowHeight, position.bottom);
      const shouldPositionBelow = viewBoxHelpers.shouldPositionBelow(position.top);
      let elPos;
      if (overridePos && positions[overridePos]) {
        elPos = positions[overridePos]({
          position,
          tourElWidth,
          tourElHeight,
          arrowSize: this.props.arrowSize,
          offsetHeight: el.offsetHeight,
          margin
        });
      } else if (shouldPositionLeft && !shouldPositionAbove && !shouldPositionBelow) {
        elPos = positions.left({position, tourElWidth, margin});
      } else if (shouldPositionAbove) {

        elPos = shouldPositionLeft
          ? positions.topLeft({position, tourElWidth, tourElHeight, arrowSize: this.props.arrowSize, margin})
          : positions.top({position, tourElHeight, arrowSize: this.props.arrowSize, margin});
      } else if (shouldPositionBelow) {
        elPos = shouldPositionLeft
          ? positions.bottomLeft({position, tourElWidth, arrowSize: this.props.arrowSize, offsetHeight: el.offsetHeight, margin})
          : positions.bottom({position, arrowSize: this.props.arrowSize, offsetHeight: el.offsetHeight, margin});
      } else {
        elPos = positions.right({position, margin});
      }

      this.prevPos = elPos;
      return elPos;
    } else {
      return this.prevPos;
    }
  }

  _renderNextButton = () => {
    if (this.props.step !== this.props.steps.length) {
      return (
        <Button onclick={() => this.props.onNext(this.props.step + 1)} text={this.props.nextButtonText} class={'ln-btn-primary'}></Button>
      )
    } else {
      return '';
    }
  }
  _renderDoneButton = () => {
    return (this.props.step === this.props.steps.length
      ? <Button onclick={this.props.onCancel} text={this.props.doneButtonText} class={'ln-btn-primary'}></Button>
      : "");
  }
  _renderBackButton = () => {
    return (this.props.step !== 1
      ? <Button onclick={() => this.props.onBack(this.props.step - 1)} text={this.props.backButtonText}></Button>
      : <div></div>);
  }
  _renderCloseButton = () => {
    return (
      <button onClick={this.props.onCancel} className="ln-btn-small ln-user-tour-close">
        <span className="ln-icon ln-icon-close-dark"></span>
      </button>
    )
  }

  _renderButtons = () => {
    return (
      <div className="ln-button--wrapper">
        {this._renderBackButton()}
        {this._renderNextButton()}
        {this._renderDoneButton()}
      </div>
    )
  }

  render() {
    //get all data from the curren step;
    const currentTourStep = this.props.steps.filter(step => step.step === this.props.step)[0];
    if (!this.props.active || !currentTourStep) {
      return <span/>;
    }

    //get the absolute posotion of the element and where the popup should be located;
    const position = this.getStepPosition(currentTourStep.selector, this.props.style.width, this.props.style.height, currentTourStep.position, currentTourStep.margin);

    //start the function that should be fired on the start of the popup;
    currentTourStep.onStart();
    return (
      <div className={`ln-user-tour-container`}>
        <Anime translateX={position.left} translateY={position.top}>
          <div className={`ln-user-tour-box ln-user-tour--arrow ln-user-tour--arrow-${position.positioned}`}>
            {this._renderCloseButton()}
            <div className="ln-user-tour--content">
              <h1>{currentTourStep.title}</h1>
              <p>{currentTourStep.body}</p>
            </div>
            {this._renderButtons()}
          </div>
        </Anime>
      </div>
    );
  }
}

ReactUserTour.defaultProps = {
  style: {
    height: 250,
    width: 300
  },
  containerStyle: {},
  onCancel: () => {},
  onNext: () => {},
  onBack: () => {},
  nextButtonText: "Next",
  backButtonText: "Back",
  doneButtonText: "Finish",
  closeButtonText: "Close",
  hideButtons: false,
  hideClose: false,
  arrowColor: "#fff",
  arrowSize: 15
};
