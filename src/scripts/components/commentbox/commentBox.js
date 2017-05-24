'use strict';

/* Setup ==================================================================== */
import React, {Component} from 'react';
import Anime from 'react-anime';

import ext from '../../utils/ext';
import message from '../../utils/message.js';

//import components
import Button from '../button'
import TextareaAutosize from '../textareaAutosize/textareaAutosize';
import FileItem from './fileItem'
import Loader from '../loader/loader';

//import helpers
import helpers, {translate} from '../../utils/helpers';
import generalConfig from '../../config/general';
// import data from '../../utils/data''Turn Layernotes On'
import routerHelper from '../router/routerHelper'

/* Component ==================================================================== */
class CommentBox extends Component {

  //this are the default props
  static defaultProps = {
    ticket: {
      ticketText: '', //the text of the ticket
      isUploaded: false, //if the ticket is uploaded or not
      data: { // the data object
        browserData: {
          browserName: 'chrome'
        },
        screenresolution: { //default screenresolution
          height: 1200,
          width: 1000
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
    bugtrackerUrl: 'http://localhost:8989/view.php?id=', //TODO get this from database
    positionClass: 'ln-commentbox-left', //the default class
    isLoading: false,
    loadingText: translate('loadingText'), //the loading title
    inEditMode: false,
    onSubmit: () => {},
    onchange: () => {},
    onCancel: (e) => {
      routerHelper.setStateApp('home'); //go to the home page
      e.preventDefault();
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      isError: false, //it the error should be shown
      errorText: '', // the error text
      scale: [1] //Do not scale by default
    };
  }
  componentWillUnmount() {
    this.setState({
      scale: [1, 0.3]
    })
  }

  /**
     * Adds for normal inputs
     * @param   {e} the event of the input
     */
  _handleStateChange = (e) => {
    //get the new state from the old state
    let newState = helpers.setNewState(this.props.ticket, e.target.name, e.target.value);
    this.props.onchange(newState);
  }

  /**
     * For the checkbox
     * @param   {e} the event of the input
     */
  _checkboxStateChange = (e) => {
    //set the checked state to value;
    let newState = helpers.setNewState(this.props.ticket, e.target.name, e.target.checked);
    this.props.onchange(newState);
  }

  /**
     * Preview the newe file
     * @param   {e} The event
     * @adds {the file to the ticket object}
     */
  _previewFiles = (e) => {
    let assets = helpers.clone(this.props.ticket.assets);
    const _this = this;
    //check if there is a file selected
    if (e.target.files && e.target.files[0]) {
      //create a file rreader
      let FR = new FileReader();

      //the new file object
      let newFile = {
        name: e.target.files[0].name, //the name of the file
        file_type: e.target.files[0].type, //with underscore becouse mantis APi requer this
        show: true, //show it in the list or not
        size: e.target.files[0].size, //the pure size, will be conferted in the FileItem.js
        id: helpers.generateUUID() //a random genreated id
      }

      //add a listner to the load
      FR.addEventListener("load", function(event) {

        //get the content form the file reader
        newFile.content = event.target.result.split(',')[1], //get ONLY THE  data from the base64 string
        //push the file to the assets object
        assets.push(newFile);

        //set the new state based on the old ticket;
        let newState = helpers.setNewState(_this.props.ticket, 'assets', assets);

        //set the new state;
        _this.props.onchange(newState);
      });

      //load the file
      FR.readAsDataURL(e.target.files[0]);
    }
  }

  /**
   * Remove a file
   * @param {e} Catch the click on the trash icon;
   */
  _removeFile = (e) => {
    //create a new list without the selected one.
    let newAssetList = this.props.ticket.assets.filter(function(file) {
      if (file.id !== e.target.getAttribute('data-id')) { //get the id of the element
        return file;
      }
    });
    let newState = helpers.setNewState(this.props.ticket, 'assets', newAssetList);
    //set the new state
    this.props.onchange(newState);

    //prevent the Default behavior
    e.preventDefault();
  }

  /**
   *the submition;
   * @param   {e} Catch the click on the trash icon;
   */
  _prepareSumbit = (e) => {
    if (this.props.ticket.ticketText.length < 2) {
      this.setState({isError: true, errorText: translate('commentBoxErrorText')})
    } else {
      this.props.onSubmit();
    }
    e.preventDefault();
  }
  /**
   * resize the window this is a event to the background script
   * @param  {Number, number, e} width, height, e
   */
  _windowRezise = (width, height, e) => {

    //rezize the browser window
    message.send('rezize', {
      width: width,
      height: height
    });

    //prefent submit
    e.preventDefault();
  }

  /**
   * Go the the bugtracker this is a event to the background script
   * @param  {e}  event from onclick
   */
  _goToBugtracker = (e) => {
    const url = this.props.bugtrackerUrl + this.props.ticket.id;

    //open a new window with the bugtracker ticket
    message.send('open', {url: url});

    //prefent submit
    e.preventDefault();
  }

  /**
     * the RENDER section
     */
  _renderFiles = () => {
    let _this = this;

    //Check if ther assets to show
    if (this.props.ticket.assets !== undefined && this.props.ticket.assets.length > 0) { //only render files when they exist;
      var listItems = this.props.ticket.assets.map(function(item, index) {
        if (item.show) { ///only show the assets that have a true on show
          return (
            <FileItem removeFile={_this._removeFile} key={index} name={item.name} id={item.id} size={item.size}></FileItem>
          );
        }
      });

      //render
      return (
        <ul className={'ln-file--list'}> {listItems} </ul>
      );
    } else { //there are no files so do not show theim
      return '';
    }
  }

  //set the posiotn of the comment box
  _setPosition = () => {
    //this comment box is used 2 times in the app. When creating and edditigng isseu;
    let position = {
      style: {
        top: null
      },
      class: 'ln-commentbox-left'
    };
    if (this.props.inEditMode) { // when edditing also ad the left prop;
      position.style.left = this.props.ticket.position.x;

      //when the position of the box is on the right side posion the box on the right;
      if (this.props.ticket.position.x > (generalConfig.maxX(0) /2) - 100) {
        position.style.left = this.props.ticket.position.x - 480 + this.props.ticket.position.width;
        position.class = 'ln-commentbox-right';
      }
      position.style.top = this.props.ticket.position.height + this.props.ticket.position.y; //only add the top prop to the style when creating;
    } else if (!this.props.inEditMode) { //when in eddit mode the elemt is abosultie postioned on the page. becouse the elemnt is reused for everery element
      position.class = this.props.positionClass;
      position.style.top = this.props.ticket.position.height;
    }
    return position;
  }

  //Render the pro buttn
  _renderPrioButton = () => {
    return (
      <div className="ln-checkbox--wrapper">
        <input id="commentbox_prio" name="isImportant" checked={this.props.ticket.isImportant} onChange={this._checkboxStateChange} className={'ln-checkbox'} type="checkbox"/>
        <label htmlFor="commentbox_prio" title={translate('commentBoxPrioCheckboxTitle')} className="ln-btn ln-btn-primary">
          <span className="ln-icon ln-icon-important"></span>
        </label>
      </div>
    );
  }
  //Render file upload button
  _renderFileUploadButton = () => {
    return (
      <div className="ln-file-input">
        <input type="file" value="" name="upload" onChange={this._previewFiles.bind(this)} id="ln-field-file"/>
        <label htmlFor="ln-field-file" className={'ln-btn ln-btn-primary ln-btn-icon'} title="Add a file">
          <span className="ln-icon ln-icon-file"></span>
          <span className="ln-attachment-text"></span>
        </label>
      </div>
    );
  }

  //render the error;
  _renderError = () => {
    if (this.state.isError) {
      return (
        <span className={'ln-commentbox-error'}>{this.state.errorText}</span>
      );
    } else {
      return '';
    }
  }

  // When the app is in edit mode show more context to the ticket
  _renderExtraInfo = () => {
    if (this.props.inEditMode) {
      return (
        <div className={'ln-commentbox--info'}>
          <div>
            <span className={`ln-icon ln-icon-${this.props.ticket.data.browserData.browserName}`} title={translate('commentBoxAboutBrugtrackerTitle', this.props.ticket.data.browserData.browserName)}></span>
            <button className="ln-btn-transparant" onClick={this._windowRezise.bind(this, this.props.ticket.data.screenresolution.width, this.props.ticket.data.screenresolution.height)} title={translate('commentBoxResize')}>{this.props.ticket.data.screenresolution.width}
              &nbsp;x&nbsp;{this.props.ticket.data.screenresolution.height}</button>
          </div>
          <div>
            <button className="ln-btn-transparant" title={translate('commentBoxStatusTitle', 'New')} onClick={this._goToBugtracker.bind(this)}>New</button>
            <button className="ln-btn-transparant" onClick={this._goToBugtracker.bind(this)} title={translate('commentBoxBugtrackerTitle')}>#{this.props.ticket.id}</button>
          </div>
        </div>
      );
    } else { //the app is not in eddit mode
      return '';
    }
  }

  _renderOverLay = () => { //show a overlay over the box
    if (this.props.isLoading === true) { //show a loading overlay
      return (
        <div className={'ln-commentbox--loading'}>
          <Loader color={'white'} loadingText={this.props.loadingText}></Loader>
        </div>
      )
    } else if (this.props.isUploaded === true) { //show a confirm that the ticket is uploaded
      return (
        <div className={'ln-commentbox--done ln-center'}>
          <div>
            <span className={'ln-icon ln-icon-succes-white'}></span>
          </div>
          <p>{ translate('commentBoxSucces')}</p>
        </div>
      )
    } else { //do not render anything
      return '';
    }
  }

  render = () => {
    return (
      <Anime left={this._setPosition().style.left} top={this._setPosition().style.top} scale={this.state.scale}>
        <form className={`ln-commentbox ${this._setPosition().class}`} onSubmit={this._prepareSumbit} method="POST">
          {this._renderOverLay()}

          {this._renderError()}
          {this._renderExtraInfo()}
          <TextareaAutosize minRows={3} onChange={this._handleStateChange.bind(this)} name="ticketText" className="ln-commentbox--textarea" useCacheForDOMMeasurements value={this.props.ticket.ticketText} placeholder="Descibe here your problem."></TextareaAutosize>
          {this._renderFiles()}
          <div className="ln-commentbox--tools">
            <div className={'ln-commentbox--tools--left'}>
              {this._renderPrioButton()}
              {this._renderFileUploadButton()}
            </div>
            <div className={'ln-commentbox--tools--right'}>
              <Button class={'ln-btn-primary'} text={translate('commentBoxCancelValue')} onclick={this.props.onCancel} title={translate('commentBoxCancelTitle')}></Button>
              <input className="ln-btn ln-btn-secondary" type="submit" value={translate('commentBoxSaveValue')} title={translate('commentBoxSaveTitle')}></input>
            </div>
          </div>
        </form>
      </Anime>
    );
  }
};

// * Export Component ==================================================================== * /
export default CommentBox;
