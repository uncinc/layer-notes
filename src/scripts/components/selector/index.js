'use strict';

/* Setup ==================================================================== */
import React, { Component } from 'react'; // eslint-disable-line no-unused-var
// tools
import generalConfig from '../../config/general';

// helpers
import helpers, { translate, setMinMaxWidth } from '../../utils/helpers';
import SelectorHelper from './selectorHelper'; // eslint-disable-line no-unused-vars
import routerHelper from '../router/routerHelper';

// components
import SelectorBackground from './SelectorBackground'; // eslint-disable-line no-unused-vars
import CommentBox from './../commentbox'; // eslint-disable-line no-unused-vars
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

      // this are helpers
      startX: -1,
      startY: -1,
      x: -1,
      y: -1
      // last_position: {}
    };
  }
  componentWillMount() {
    this._takeScreenshot(translate('selectorScreenshotName'));
  }

  componentDidMount() {
    this._addMouseEvents();
  }

  componentWillUnmount() {
    this._removeMouseEvents();
  }
  // mouse and key listners
  _addMouseEvents() {
    document.addEventListener('mousedown', this.onMouseDown, false);
    document.addEventListener('mousemove', this.onMouseMove, false);
    document.addEventListener('mouseup', this.onMouseUp, false);
    document.addEventListener('keypress', this.onKeyDown, false);
  }

  // remove all the events
  _removeMouseEvents() {
    document.removeEventListener('mousedown', this.onMouseDown, false);
    document.removeEventListener('mousemove', this.onMouseMove, false);
    document.removeEventListener('mouseup', this.onMouseUp, false);
    document.removeEventListener('keypress', this.onKeyDown, false);
  }

  // set the start of the drawing of the square
  onMouseDown = e => {
    e.preventDefault();
    if (this.state.isDrawing) {
      this.setState({ cursorStyle: 'default', isDrawing: false });
    } else {
      this.setState({
        isDrawing: true, // set drawing state
        startX: this.state.x, // x position
        startY: this.state.y // y position
      });
      this.onMouseMove(e);
    }
  };

  // listen to the esc key. Then go the home page;
  onKeyDown = e => {
    const ESC_KEY = 27;

    if (e.keyCode === ESC_KEY) {
      // 27 === EXC key
      this._removeMouseEvents();
      routerHelper.setStateApp('home');
    }
  };

  _takeScreenshot = screenshotName => {
    const _this = this;
    return new Promise((resolve, reject) => {
      try {
        message
          .send('takeScreenschot', {})
          .then(image => {
            const oldState = _this.state.ticket.assets;
            const newScreenshot = {
              name: screenshotName, // the name of the file
              size: image.data.length, // the pure size, will be conferted in the FileItem.js
              content: image.data,
              show: false,
              file_type: 'image/jpeg',
              id: helpers.generateUUID() // a random genreated id
            };
            oldState.push(newScreenshot);
            const newStateTicket = helpers.setNewState(
              _this.state.ticket,
              'assets',
              oldState
            );
            _this.setState({ ticket: newStateTicket, screenshotTaken: true });
          })
          .then(() => {
            resolve(true);
          });
      } catch (err) {
        console.error(`>-------------------: Error ${err.message}`, err);
        reject(err);
      }
    });
  };

  // when de drawing is stoped hide the comment box and stop the events.
  onMouseUp = () => {
    this.props.onSelected();
    this.checkSelection();
    this.setState({
      isDrawing: false,
      cursorStyle: 'default',
      showCommentbox: true,
      positionClass: this._checkClassname()
    });
    this._removeMouseEvents();
    this._checkCommentBoxIsInView();
  };

  // set the classname;
  // so the position of the comment box is on the left or right side;
  _checkClassname = () => {
    const MARGIN = 100;
    return this.state.ticket.position.x > generalConfig.maxX(0) / 2 - MARGIN
      ? 'ln-commentbox-right'
      : 'ln-commentbox-left';
  };

  _checkCommentBoxIsInView = () => {
    const positionY = this.state.ticket.position.y;
    const pageHeight = helpers.pageHeight();

    if (positionY < pageHeight && positionY > 10) {
      helpers.scrollTo(0, positionY);
    }
  };

  //  for setting the new state in the ticket {Object}
  handleStateChange = newState => {
    // set the new state to the selected ticket;
    this.setState({ ticket: newState });
  };

  checkSelection = () => {
    let { width, height } = this.state.ticket.position;
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
    let newStateTicket = helpers.setNewState(
      this.state.ticket,
      'position',
      position
    );
    this.setState({ ticket: newStateTicket });
    return true;
  };

  onMouseMove = e => {
    this._setMousePosition(e);

    if (this.state.isDrawing) {
      let position = {
        width: Math.abs(this.state.x - this.state.startX),
        height: Math.abs(this.state.y - this.state.startY),
        x:
          this.state.x - this.state.startX < 0
            ? this.state.x
            : this.state.startX,
        y:
          this.state.y - this.state.startY < 0
            ? this.state.y
            : this.state.startY
      };
      let newStateTicket = helpers.setNewState(
        this.state.ticket,
        'position',
        position
      );

      this.setState({ ticket: newStateTicket });
    }

    // fix for the browser behavior to take a image;
    e.preventDefault();
  };

  _onCommentBoxSubmit = () => {
    let _this = this;
    _this.setState({
      isLoading: true,
      loadingText: translate('selectorLoadingText')
    });
    // take a screenshot of the selected item
    this._takeScreenshot(translate('selectorScreenshotNameAfter')).then(
      () => {
        message
          .send('submitNewTicket', {
            ticket: _this.state.ticket,
            hostname: generalConfig.hostname,
            url: generalConfig.url,
            shortlink: generalConfig.shortlink
          })
          .then(() => {
            setTimeout(() => {
              _this.setState({ isLoading: false, isUploaded: true });
            }, 600);
            setTimeout(() => {
              _this.setState({ isUploaded: false });
              routerHelper.setStateApp('home');
            }, 2000);
          });
      }
    );
  };

  updateFrame = (position) => {
    // console.log(position);
    this.setState({
      ...this.state,
      ticket: {
        ...this.state.ticket,
        position: {
          ...this.state.ticket.position,
          ...position,
        },
      },
    });
  };

  _setMousePosition = e => {
    let ev = e || window.event; // Moz || IE
    let margin = 10;
    let bodyHeight = helpers.pageHeight();

    if (ev.pageX) {
      // Moz
      this.setState({
        x: setMinMaxWidth(ev.pageX, 0, window.innerWidth - margin),
        y: setMinMaxWidth(ev.pageY, 0, bodyHeight - margin)
      });
    } else if (ev.clientX) {
      // IE
      this.setState({
        x: setMinMaxWidth(
          ev.clientX + document.body.scrollLeft,
          0,
          window.innerWidth - margin
        ),
        y: setMinMaxWidth(
          ev.clientY + document.body.scrollTop,
          0,
          window.innerWidth - margin
        )
      });
    }
  };

  /**
   * RENDER
   */
  helperElement = () => {
    if (!this.state.showCommentbox) {
      return (
        <span
          className="ln-canvas--helper"
          style={{
            left: this.state.x + 'px',
            top: this.state.y + 'px'
          }}
        >
          {translate('selectorHelper')}
        </span>
      );
    }
    return '';
  };

  renderCommentBox = () => {
    if (this.state.showCommentbox) {
      return (
        <CommentBox
          ticket={this.state.ticket}
          positionClass={this.state.positionClass}
          loadingText={this.state.loadingText}
          isUploaded={this.state.isUploaded}
          isLoading={this.state.isLoading}
          onSubmit={this._onCommentBoxSubmit}
          onchange={this.handleStateChange}
        />
      );
    }
    return '';
  };

  drawElement = () => {
    return (
      <div>
        <div
          className="ln-rectangle"
          style={{
            left: this.state.ticket.position.x + 'px',
            top: this.state.ticket.position.y + 'px',
            height: this.state.ticket.position.height + 'px',
            width: this.state.ticket.position.width + 'px'
          }}
        >
          <SelectorHelper
            width={this.state.ticket.position.width}
            height={this.state.ticket.position.height}
            left={this.state.ticket.position.x}
            top={this.state.ticket.position.y}
            showCommentbox={this.state.showCommentbox}
            updateFrame={this.updateFrame}
          />
          {this.renderCommentBox()}
        </div>
        <SelectorBackground
          width={this.state.ticket.position.width}
          height={this.state.ticket.position.height}
          left={this.state.ticket.position.x}
          top={this.state.ticket.position.y}
        />
      </div>
    );
  };

  render = () => {
    // so the screenshot can be made before the background layer;
    if (this.state.screenshotTaken) {
      return (
        <div
          className="ln-canvas"
          style={{
            cursor: this.state.cursorStyle
          }}
        >
          {this.drawElement()}
          {this.helperElement()}
        </div>
      );
    }
    return <div />;
  };
}

/* Export Component ==================================================================== */
export default Selector;