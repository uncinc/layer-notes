'use strict';

/* Setup ==================================================================== */
import React, {Component} from 'react';

//tools
import ext from '../../utils/ext';
import generalConfig from '../../config/general';

//helpers
import {select, setMinMaxWidth} from '../../utils/helpers';
import SelectorHelper from './selectorHelper';
import routerHelper from '../router/routerHelper'

//components
import SelectorBackground from './SelectorBackground'
import CommentBox from './../commentbox/commentBox';
import helpers, {translate} from '../../utils/helpers';
import message from '../../utils/message';

/* Component ==================================================================== */
class Selector extends Component {
  static defaultProps = {
    onSelected: () => {}
  };

  constructor(props) {
    super(props);

    this.state = {
      isDrawing: false,
      isUploaded: false,
      showCommentbox: false,
      isLoading: false,
      screenshotTaken: false,
      cursorStyle: 'crosshair',
      ticket: {
        ticketText: '',
        data: {
          screenresolution: {
            height: window.outerHeight,
            width: window.outerWidth,
            pixelRatio: window.devicePixelRatio
          }
        },
        isImportant: false,
        assets: [],
        position: {
          x: 0,
          y: 0,
          width: 0,
          height: 0
        }
      },

      //this are helpers
      startX: -1,
      startY: -1,
      x: -1,
      y: -1,
      last_position: {}
    };

  }
  componentWillMount() {
    this._takeScreenshot(translate('selectorScreenshotName'));
  }

  componentDidMount(props) {
    this._addMouseEvents();
  }

  componentWillUnmount() {
    this._removeMouseEvents();
  }
  //mouse and key listners
  _addMouseEvents() {
    document.addEventListener('mousedown', this._onMouseDown, false);
    document.addEventListener('mousemove', this._onMouseMove, false);
    document.addEventListener('mouseup', this._onMouseUp, false);
    document.addEventListener('keypress', this._onKeyDown, false);

  }

  //remove all the events
  _removeMouseEvents() {
    document.removeEventListener('mousedown', this._onMouseDown, false);
    document.removeEventListener('mousemove', this._onMouseMove, false);
    document.removeEventListener('mouseup', this._onMouseUp, false);
    document.removeEventListener('keypress', this._onKeyDown, false);
  }

  //set the start of the drawing of the square
  _onMouseDown = (e) => {
    e.preventDefault();
    if (this.state.isDrawing) {
      this.setState({cursorStyle: "default", isDrawing: false})

    } else {
      this.setState({
        isDrawing: true, //set drawing state
        startX: this.state.x, //x position
        startY: this.state.y, //y position
      });
      this._onMouseMove(e);
    }
  }

  //listen to the esc key. Then go the home page;
  _onKeyDown = (e) => {
    if (e.keyCode === 27) { //27 === EXC key
      this._removeMouseEvents();
      routerHelper.setStateApp('home');
    }
  }

  _takeScreenshot = (screenshotName) => {
    const _this = this;
    return new Promise(function(resolve, reject) {
      try {
        message.send('takeScreenschot', {}).then(function(image) {
          let oldState = _this.state.ticket.assets;
          let newScreenshot = {
            name: screenshotName, //the name of the file
            size: image.data.length, //the pure size, will be conferted in the FileItem.js
            content: image.data,
            show: false,
            file_type: 'image/jpeg',
            id: helpers.generateUUID(), //a random genreated id
          };
          oldState.push(newScreenshot);
          let newStateTicket = helpers.setNewState(_this.state.ticket, 'assets', oldState);
          _this.setState({ticket: newStateTicket, screenshotTaken: true});
        }).then(function() {
          resolve(true);
        });
      } catch (err) {
        console.error(`>-------------------: Error ${err.message}`, err);
        reject(err);
      }
    });
  }

  //when de drawing is stoped hide the comment box and stop the events.
  _onMouseUp = (e) => {
    this.props.onSelected();
    this._checkSelection();
    this.setState({isDrawing: false, cursorStyle: 'default', showCommentbox: true, positionClass: this._checkClassname()});
    this._removeMouseEvents();
  }

  //set the classname;
  //so the position of the comment box is on the left or right side;
  _checkClassname = () => {
    return (this.state.ticket.position.x > (generalConfig.maxX(0) / 2) - 100)
      ? 'ln-commentbox-right'
      : 'ln-commentbox-left';
  }

  // for setting the new state in the ticket {Object}
  _handleStateChange = (newState) => {
    //set the new state to the selected ticket;
    this.setState({ticket: newState});
  }

  _checkSelection = () => {
    let {width, height} = this.state.ticket.position;
    let position = {
      height: height,
      width: width,
      x: this.state.ticket.position.x,
      y: this.state.ticket.position.y
    };

    if (width < generalConfig.minWidth) {
      position.width = generalConfig.minWidth;
    }

    if (height < generalConfig.minHeight) {
      position.height = generalConfig.minHeight;
    }
    let newStateTicket = helpers.setNewState(this.state.ticket, 'position', position);
    this.setState({ticket: newStateTicket});
    return true;
  }

  _onMouseMove = (e) => {

    this._setMousePosition(e);

    if (this.state.isDrawing) {
      let position = {
        width: Math.abs(this.state.x - this.state.startX),
        height: Math.abs(this.state.y - this.state.startY),
        x: (this.state.x - this.state.startX < 0)
          ? this.state.x
          : this.state.startX,
        y: (this.state.y - this.state.startY < 0)
          ? this.state.y
          : this.state.startY
      };
      let newStateTicket = helpers.setNewState(this.state.ticket, 'position', position);

      this.setState({ticket: newStateTicket});
    }

    //fix for the browser behavior to take a image;
    e.preventDefault();
  }

  _onCommentBoxSubmit = () => {
    let _this = this;
    _this.setState({isLoading: true, loadingText: translate('selectorLoadingText')})
    //take a screenshot of the selected item
    this._takeScreenshot(translate('selectorScreenshotNameAfter')).then(function() {
      message.send('submitNewTicket', {
        ticket: _this.state.ticket,
        hostname: generalConfig.hostname,
        url: generalConfig.url,
        shortlink: generalConfig.shortlink
      }).then(function(newTicketData) {
        setTimeout(function() {
          _this.setState({isLoading: false, isUploaded: true});

        }, 600);
        setTimeout(function() {
          _this.setState({isUploaded: false});
          routerHelper.setStateApp('home');
        }, 2000);
      });
    });
  }

  _updateFramePosition = (left, top) => {
    let position = {
      x: left,
      y: top,
      width: this.state.ticket.position.width,
      height: this.state.ticket.position.height
    };
    let newStateTicket = helpers.setNewState(this.state.ticket, 'position', position);

    this.setState({ticket: newStateTicket, positionClass: this._checkClassname()});
  }

  _updateFrameSize = (prop, value) => {
    this.setState({[prop]: value});
  }

  _setMousePosition = (e) => {
    let ev = e || window.event; //Moz || IE
    let margin = 10;
    let bodyHeight = helpers.pageHeight();

    if (ev.pageX) { //Moz
      this.setState({
        x: setMinMaxWidth(ev.pageX, 0, window.innerWidth - margin),
        y: setMinMaxWidth(ev.pageY, 0, bodyHeight - margin)
      });

    } else if (ev.clientX) { //IE
      this.setState({
        x: setMinMaxWidth(ev.clientX + document.body.scrollLeft, 0, window.innerWidth - margin),
        y: setMinMaxWidth(ev.clientY + document.body.scrollTop, 0, window.innerWidth - margin)
      });
    }
  }

  /**
   * RENDER
   */
  _helperElement = () => {
    if (!this.state.showCommentbox) {
      return (
        <span className="ln-canvas--helper" style={{
          left: this.state.x + 'px',
          top: this.state.y + 'px'
        }}>
          {translate('selectorHelper')}
        </span>
      );
    }
    return '';
  }

  _renderCommentBox = () => {
    if (this.state.showCommentbox) {
      return (
        <CommentBox ticket={this.state.ticket} positionClass={this.state.positionClass} loadingText={this.state.loadingText} isUploaded={this.state.isUploaded} isLoading={this.state.isLoading} onSubmit={this._onCommentBoxSubmit} onchange={this._handleStateChange}></CommentBox>
      );
    } else {
      return '';
    }
  }

  _drawElement = () => {
    return (
      <div>
        <div className="ln-rectangle" style={{
          left: this.state.ticket.position.x + 'px',
          top: this.state.ticket.position.y + 'px',
          height: this.state.ticket.position.height + 'px',
          width: this.state.ticket.position.width + 'px'
        }}>
          <SelectorHelper width={this.state.ticket.position.width} left={this.state.ticket.position.x} showCommentbox={this.state.showCommentbox} updateFramePosition={this._updateFramePosition} updateFrameSize={this._updateFrameSize}></SelectorHelper>
          {this._renderCommentBox()}
        </div>
        <SelectorBackground width={this.state.ticket.position.width} height={this.state.ticket.position.height} left={this.state.ticket.position.x} top={this.state.ticket.position.y}></SelectorBackground>
      </div>
    );
  }

  render = () => {
    //so the screenshot can be made before the background layer;
    if (this.state.screenshotTaken) {
      return (
        <div className="ln-canvas" style={{
          cursor: this.state.cursorStyle
        }}>
          {this._drawElement()}
          {this._helperElement()}
        </div>
      );
    } else {
      return (
        <div></div>
      );
    }

  }
};

/* Export Component ==================================================================== */
export default Selector;
