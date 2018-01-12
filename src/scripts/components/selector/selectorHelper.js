'use strict';

/* Setup ==================================================================== */
import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import generalConfig from '../../config/general';
import propTypes from 'prop-types';

// helpers
import { setMinMaxWidth, inverse } from '../../utils/helpers';
import routerHelper from '../router/routerHelper';

/* Component ==================================================================== */
class SelectorHelper extends Component {
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
      differenceY: 0,
    };
  }

  // remove the events when the elemnt is gone
  componentWillUnmount() {
    this.removeMouseEvents();
  }

  addMouseEvents() {
    document.addEventListener('mousemove', this._onMouseMove, false);
    document.addEventListener('mouseup', this.onMouseUp, false);
    document.addEventListener('keypress', this.onKeyDown, false);
  }

  removeMouseEvents() {
    document.removeEventListener('mousemove', this._onMouseMove, false);
    document.removeEventListener('mouseup', this.onMouseUp, false);
    // document.removeEventListener('keypress', this.onKeyDown, false);
  }
  onKeyDown = (e) => {
    const KEY_ESC = 27; // the esc key
    if (e.keyCode === KEY_ESC) {
      this.removeMouseEvents();
      routerHelper.setStateApp('home'); // go to the home
    }
  };

  /**
   * check wat for movement is going on based on the elemnt class
   * @param   {String}  A classname
   * @returns {Object} a object with the movement and the elemnt
   */
  checkTransform = (className) => {
    if (className === 'ln-rectangle--draggingarea') {
      return { movement: 'move', element: null };
    } else if (
      className === 'ln-rectangle-left-bottom' ||
      className === 'ln-rectangle-left-top' ||
      className === 'ln-rectangle-right-bottom' ||
      className === 'ln-rectangle-right-top'
    ) {
      return { movement: 'scale' };
    }
    return null;
  };

  /**
   * When the mouse is down add other mouse events
   * @param {e}  e
   */
  onMouseDown = (e) => {
    let checkTransform = this.checkTransform(e.target.className);
    this.addMouseEvents();
    this.setState({
      isDragging: true,
      movement: checkTransform.movement,
      element: e.target.className,
    });
  };

  /**
   * remove all events when the mouse is up
   * @param   {e}  e
   */
  onMouseUp = () => {
    this.removeMouseEvents();
    this.setState({ isDragging: false, movement: null, element: null });
  };

  /**
   * Check the mouse mouve now only works with move, noet with dragging the corners
   * @param   {e}  e
   */
  _onMouseMove = (e) => {
    this.setMousePosition(e);
    // let _this = this;

    if (this.props.showCommentbox && this.state.isDragging) {
      //the move movement
      if (this.state.movement === 'move') {
        const proposedValue = {
          x: this.state.x - (this.props.width / 2),
          y: this.state.y - (this.props.height / 2) - window.scrollY,
        };

        const newPosition = {
          x: setMinMaxWidth(
            proposedValue.x,
            generalConfig.minX,
            generalConfig.maxX(this.props.width),
          ),
          y: setMinMaxWidth(
            proposedValue.y,
            generalConfig.minY,
            generalConfig.maxY(this.props.height),
          ),
        };
        this.props.updateFrame(newPosition);

        // the scale of the element this is work in progress
      } else if (this.state.movement === 'scale') {
        const { directions } = this.state;
        const proposedValue = {
          y: this.props.top,
          x: this.props.left,
        };

        if (this.state.element === 'ln-rectangle-left-bottom') {
          proposedValue.width = this.props.width + inverse(this.state.differenceX);
          // proposedValue.height = this.props.height + inverse(this.state.differenceY);
          proposedValue.x = proposedValue.x - inverse(this.state.differenceX);
          // console.log('proposedValue', proposedValue);
          // console.log('inverse(this.state.differenceX)', inverse(this.state.differenceX));
          this.props.updateFrame(proposedValue);

        }
      }
    }
  };


  setMousePosition = (e) => {
    var ev = e || window.event; // Moz || IE
    if (ev.pageX) {
      // Moz
      // console.log(ev.pageX + window.pageXOffset - this.state.x);
      this.setState({
        differenceX: (ev.pageX + window.pageXOffset) - this.props.left,
        differenceY: ev.pageY + window.pageYOffset,
        x: ev.pageX + window.pageXOffset,
        y: ev.pageY + window.pageYOffset
      });
    } else if (ev.clientX) {
      // this is a fix for IE
      this.setState({
        differenceX: ev.clientX + document.body.scrollLeft - this.props.left,
        differenceY: ev.clientY + document.body.scrollTop - this.props.top,
        x: ev.clientX + document.body.scrollLeft,
        y: ev.clientY + document.body.scrollTop
      });
    }
  };

  /**
   * RENDER
   */
  render = () => {
    if (this.props.showCommentbox) {
      return (
        <div
          onMouseDown={this.onMouseDown}
          onMouseUp={this.onMouseUp}
          className="ln-rectangle--draggingarea"
        >
          <div className="ln-rectangle-left-top" />
          <div className="ln-rectangle-left-bottom" />
          <div className="ln-rectangle-right-top" />
          <div className="ln-rectangle-right-bottom" />
        </div>
      );
    }
    return <div />;
  };
}

SelectorHelper.defaultProps = {
  left: 0,
  top: 0,
  width: 0,
  height: 0,
  showCommentbox: false,
  updateFrame: () => {},
};

SelectorHelper.propTypes = {
  left: propTypes.number,
  top: propTypes.number,
  width: propTypes.number,
  height: propTypes.number,
  showCommentbox: propTypes.bool,
  updateFrame: propTypes.func,
};

/* Export Component ==================================================================== */
export default SelectorHelper;