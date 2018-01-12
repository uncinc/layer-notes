'use strict';

/* Setup ==================================================================== */
/*eslint-disable no-unused-vars*/
import React, { Component } from 'react';
import Anime from 'react-anime';

import generalData from '../../config/general';

// components
import ToolBar from '../../components/toolbar';

// Layout
import CommentBox from '../../components/commentbox';

// helpers
import { translate } from '../../utils/helpers';
import message from '../../utils/message';

/* eslint-disable no-unused-vars */

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
      filtertTotal: 0,
    };
  }

  componentWillMount() {
    let _this = this;

    // get all tickers
    message
      .send('getTicketsFromPage', {
        url: generalData.url,
        hostname: generalData.hostname,
        shortlink: generalData.shortlink
      })
      .then((tickets) => {
        // set all tickets
        _this.setState({
          savedTickets: tickets.data.filtertTickets,
          filtertTotal: tickets.data.filtertTicketsAmout,
          total: tickets.data.allTicketsFromThisWebsiteAmount
        });
      });
  }

  // show the comment box or not
  _showCommentBox = (e) => {
    e.preventDefault();
    const ticket = this.state.savedTickets.filter((ticket) => {
      if (ticket.id === e.target.getAttribute('data-id')) {
        // add the date to the comment box
        return ticket;
      }
    });
    this.setState({ selectedTicket: ticket[0], showCommentbox: true });
  };

  _hideCommentBox = (e) => {
    // hide the commenbox and clean the selectedTicket
    this.setState({ showCommentbox: false, selectedTicket: {} });
    // prevent submit
    e.preventDefault();
  };

  // set the new state. this is a funciton form the comment box
  _handleStateChange = (newState) => {
    // set the new state to the selected ticket;
    this.setState({ selectedTicket: newState });
  };

  // sumbit the comment box
  _onCommentBoxSubmit = () => {
    let _this = this;
    this.setState({
      isLoading: true,
      loadingText: translate('ticketsOnPageUpdating')
    });

    // send to the backend script
    message
      .send('updateTicket', {
        ticket: this.state.selectedTicket, // the ticket
      })
      .then(() => {
        // so the loading is vissible for the user
        setTimeout(() => {
          _this.setState({
            isLoading: false,
            showCommentbox: false,
            selectedTicket: {}
          });
        }, 2000);
      });
  };

  _renderCommentBox = () => {
    if (this.state.showCommentbox) {
      return (
        <CommentBox
          ticket={this.state.selectedTicket}
          onCancel={this._hideCommentBox}
          inEditMode={true}
          loadingText={this.state.loadingText}
          isLoading={this.state.isLoading}
          onSubmit={this._onCommentBoxSubmit}
          onchange={this._handleStateChange}
        />
      );
    }
    return '';
  };

  _renderIcons = () => {
    const savedTickets = this.state.savedTickets.map(ticket => {
      const buttonClass =
        this.state.selectedTicket.id === ticket.id ? 'active' : '';
      return (
        <div
          className="ln-tickets-on-page--ticket"
          key={ticket.id}
          style={{
            left: ticket.position.x,
            top: ticket.position.y,
            width: ticket.position.width,
            height: ticket.position.height
          }}
        >
          <button
            className={`ln-btn ln-btn-transparant ln-tickets-on-page--button ${
              buttonClass
            }`}
            data-id={ticket.id}
            onClick={this._showCommentBox}
            title={`Ticket ${ticket.id}`}
          >
            <span className="ln-icon ln-icon-layernotes" />
            <span className="ln-tickets-on-page--text">
              {ticket.ticketTitle}
            </span>
          </button>
          <div className="ln-tickets-on-page--area" />
        </div>
      );
    });

    return savedTickets;
  };

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
        <ToolBar
          filtertTotal={this.state.filtertTotal}
          total={this.state.total}
        />
      </div>
    );
  };
}

/* Export Component ==================================================================== */
export default TicketsOnPage;