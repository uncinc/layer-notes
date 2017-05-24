'use strict';

/* Setup ==================================================================== */
import React, {Component} from 'react';
import Anime from 'react-anime';

import ext from '../../utils/ext';
import generalData from '../../config/general'

//components
import ToolBar from '../../components/toolbar/toolbar';

//Layout
import CommentBox from '../../components/commentbox/commentBox';

//helpers
import {translate} from '../../utils/helpers';
import generalConfig from '../../config/general';
import message from '../../utils/message';

/* Component ==================================================================== */
class TicketsOnPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      savedTickets: [],
      selectedTicket: {},
      showCommentbox: false,
      isLoading: false,
      loadingText: translate('loadingText'),
      total: 0,
      filtertTotal: 0
    }
  }

  componentWillMount() {
    let _this = this;

    //get all tickers
    message.send('getTicketsFromPage', {
      url: generalData.url,
      hostname: generalData.hostname,
      shortlink: generalData.shortlink
    }).then(function(tickets) {

      //set all tickets
      _this.setState({savedTickets: tickets.data.filtertTickets, filtertTotal: tickets.data.filtertTicketsAmout, total: tickets.data.allTicketsFromThisWebsiteAmount})
    });
  }

  //show the comment box or not
  _showCommentBox = (e) => {
    e.preventDefault();
    var ticket = this.state.savedTickets.filter(function(ticket) {
      if (ticket.id === e.target.getAttribute('data-id')) { //add the date to the comment box
        return ticket;
      }
    });
    this.setState({selectedTicket: ticket[0], showCommentbox: true});
  }

  _hideCommentBox = (e) => {
    //hide the commenbox and clean the selectedTicket
    this.setState({showCommentbox: false, selectedTicket: {}})
    //prevent submit
    e.preventDefault();
  }

  //set the new state. this is a funciton form the comment box
  _handleStateChange = (newState) => {
    //set the new state to the selected ticket;
    this.setState({selectedTicket: newState});
  }


  //sumbit the comment box
  _onCommentBoxSubmit = () => {
    let _this = this;
    _this.setState({isLoading: true, loadingText: translate('ticketsOnPageUpdating')})

    //send to the backend script
    message.send('updateTicket', {
      ticket: this.state.selectedTicket // the ticket
    }).then(function(newTicketData) {

      //so the loading is vissible for the user
      setTimeout(function() {
        _this.setState({isLoading: false, showCommentbox: false, selectedTicket: {}});
      }, 2000);
    });
  }

  _renderCommentBox = () => {
    if (this.state.showCommentbox) {
      return (
        <CommentBox ticket={this.state.selectedTicket} onCancel={this._hideCommentBox} inEditMode={true} loadingText={this.state.loadingText} isLoading={this.state.isLoading} onSubmit={this._onCommentBoxSubmit} onchange={this._handleStateChange}></CommentBox>
      )
    } else {
      return '';
    }
  }

  _renderIcons = () => {
    let _this = this;
    let savedTickets = this.state.savedTickets.map(function(ticket) {
      let buttonClass = (_this.state.selectedTicket.id === ticket.id)
        ? 'active'
        : '';
      return (
        <div className="ln-tickets-on-page--ticket" key={ticket.id} style={{
          left: ticket.position.x,
          top: ticket.position.y,
          width: ticket.position.width,
          height: ticket.position.height
        }}>
          <button className={`ln-btn ln-btn-transparant ln-tickets-on-page--button ${buttonClass}`} data-id={ticket.id} onClick={_this._showCommentBox} title={`Ticket ${ticket.id}`}>
            <span className="ln-icon ln-icon-layernotes"></span>
            <span className="ln-tickets-on-page--text">{ticket.ticketTitle}</span>
          </button>
          <div className="ln-tickets-on-page--area"></div>
        </div>
      );
    });

    return (savedTickets);
  }

  /**
   * RENDER
   */
  render = () => {

    return (
      <div>
        <div className={'ln-tickets-on-page--wrapper'}>
          {this._renderIcons()}
          {this._renderCommentBox()}
        </div>
        <ToolBar filtertTotal={this.state.filtertTotal} total={this.state.total}/>
      </div>
    );
  }
};

/* Export Component ==================================================================== */
export default TicketsOnPage;
