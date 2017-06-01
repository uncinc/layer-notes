'use strict';

/* Setup ==================================================================== */
import React, {Component} from 'react';
import generalConfig from '../../config/general';

//helpers
import {setMinMaxWidth} from '../../utils/helpers';
import routerHelper from '../router/routerHelper';

/* Component ==================================================================== */
class SelectorHelper extends Component {
  static defaultProps = {
    left: 0,
    width: 0,
    height: 0,
    showCommentbox: false,
    updateFramePosition: () => {},
    updateFrameSize: () => {}
  };

  constructor(props) {
    super(props);

    this.state = {
      isDragging: false,
      movement: null,
      element: null,
      x: 0,
      y: 0,
      left: this.props.left,
      width: this.props.width,
      height: this.props.height,
      differenceX: 0,
      differenceY: 0
    };
  }

  //remove the events when the elemnt is gone
  componentWillUnmount() {
    this._removeMouseEvents();
  }

  _addMouseEvents() {
    document.addEventListener('mousemove', this._onMouseMove, false);
    document.addEventListener('mouseup', this._onMouseUp, false);
    document.addEventListener('keypress', this._onKeyDown, false);
  }

  _removeMouseEvents() {
    document.removeEventListener('mousemove', this._onMouseMove, false);
    document.removeEventListener('mouseup', this._onMouseUp, false);
    // document.removeEventListener('keypress', this._onKeyDown, false);
  }
  _onKeyDown = (e) => {
    const KEY_ESC = 27; // the esc key
    if (e.keyCode === KEY_ESC) {
      this._removeMouseEvents();
      routerHelper.setStateApp('home'); //go to a page
    }
  }

  /**
     * check wat for movement is going on based on the elemnt class
     * @param   {String}  A classname
     * @returns {Object} a object with the movement and the elemnt
     */
  _checkTransform = (className) => {
    if (className === 'ln-rectangle--draggingarea') {
      return {movement: 'move', element: null};
    } else if (className === 'ln-rectangle-left-bottom' || className === 'ln-rectangle-left-top' || className === 'ln-rectangle-right-bottom' || className === 'ln-rectangle-right-top') {
      return {movement: 'scale'};
    }
    return null;
  }

  /**
     * When the mouse is down add other mouse events
     * @param {e}  e
     */
  _onMouseDown = (e) => {
    let checkTransform = this._checkTransform(e.target.className);
    this._addMouseEvents();
    this.setState({isDragging: true, movement: checkTransform.movement, element: e.target.className});
  }

  /**
     * remove all events when the mouse is up
     * @param   {e}  e
     */
  _onMouseUp = () => {

    this._removeMouseEvents();
    this.setState({isDragging: false, movement: null, element: null});
  }

  /**
     * Check the mouse mouve now only works with move, noet with dragging the corners
     * @param   {e}  e
     */
  _onMouseMove = (e) => {
    this._setMousePosition(e);
    // let _this = this;

    if (this.props.showCommentbox && this.state.isDragging) {

      //the move movement
      if (this.state.movement === 'move') {

        let proposedValue = {
          x: this.state.x - (this.props.width / 2),
          y: this.state.y - (this.props.height / 2) - window.scrollY
        };

        let newX = setMinMaxWidth(proposedValue.x, generalConfig.minX, generalConfig.maxX(this.props.width));
        let newY = setMinMaxWidth(proposedValue.y, generalConfig.minY, generalConfig.maxY(this.props.height));

        this.props.updateFramePosition(newX, newY);

        //the scale of the elemtn this is work in progress
      } else if (this.state.movement === 'scale') {
        //TODO: make this
        // let directions = this.state.directions;
        // let proposedValue = {
        //   top: setMinMaxWidth(this.state.y, generalConfig.minY, generalConfig.maxY),
        //   left: setMinMaxWidth(this.state.x, generalConfig.minX, generalConfig.maxX),
        //   // width: this.state.width + this.state.,
        //   // height: this.state.height
        // };
        //
        // if (this.state.element === "ln-rectangle-left-top") {
        //   // console.log(proposedValue.left);
        //   proposedValue.width = this.props.width;
        //   _this.props.updateFrameSize('left', proposedValue.left);
        //   _this.props.updateFrameSize('width', proposedValue.width);
        //
        //   // console.log('this.state.width + this.state.differenceX', this.state.width + this.state.differenceX);
        //
        // }

        // console.log(proposedValue.top);

        // let newX = setMinMaxWidth(proposedValue.x, generalConfig.minX, generalConfig.maxX);
        // let newY = setMinMaxWidth(proposedValue.y, generalConfig.minY, generalConfig.maxY);
        // console.log(newX, newY);

        // directions.forEach(function(direction) {
        // console.log('direction', direction);
        // console.log('this.state.differenceX', _this.state.differenceX);
        // console.log('this.state.x', _this.state.x);

        // ln-rectangle-left-bottom"></div>
        // ln-rectangle-right-top"></div>
        // ln-rectangle-right-bottom"></div>

        // if (direction === 'left') {
        // console.log(_this.state.differenceX);
        // console.log(_this.props.height + _this.state.differenceX);

        // _this.props.updateFrameSize('height', _this.state.height + _this.state.differenceX);

        // }
        // else if (direction === 'left') {
        //   _this.props.updateFrameSize(direction, newX);
        //
        // } else if (direction === 'top') {
        //   _this.props.updateFrameSize(direction, newY);
        //
        // } else if (direction === 'width') {
        //   _this.props.updateFrameSize(direction, newX);
        // }

        // console.log(direction);
        // });

      }
    }
  }

  _setMousePosition = (e) => {
    var ev = e || window.event; //Moz || IE
    if (ev.pageX) { //Moz
      // console.log(ev.pageX + window.pageXOffset - this.state.x);
      this.setState({
        differenceX: (ev.pageX + window.pageXOffset) - this.props.left,
        differenceY: (ev.pageY + window.pageYOffset),
        x: ev.pageX + window.pageXOffset,
        y: ev.pageY + window.pageYOffset
      });

    } else if (ev.clientX) { //this is a fix for IE
      this.setState({
        differenceX: ev.clientX + document.body.scrollLeft - this.props.left,
        differenceY: ev.clientY + document.body.scrollTop - this.props.top,
        x: ev.clientX + document.body.scrollLeft,
        y: ev.clientY + document.body.scrollTop
      });
    }
  }

  /**
   * RENDER
   */
  render = () => {
    if (this.props.showCommentbox) {
      return (
        <div onMouseDown={this._onMouseDown} onMouseUp={this._onMouseUp} className="ln-rectangle--draggingarea">
          <div className="ln-rectangle-left-top"></div>
          <div className="ln-rectangle-left-bottom"></div>
          <div className="ln-rectangle-right-top"></div>
          <div className="ln-rectangle-right-bottom"></div>
        </div>
      );
    }
    return (
      <div></div>
    );
  }
}

/* Export Component ==================================================================== */
export default SelectorHelper;
