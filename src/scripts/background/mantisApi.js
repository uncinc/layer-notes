import { SOAPClient, SOAPClientParameters } from '../vendor/soapclient';

import { log } from '../utils/helpers';

/* Component ==================================================================== */
const mantisApi = (() => {
  const INTERNAL_SERVER_ERR = 500;
  const NODATA_ERR = 0;
  const NOTFOUND_ERR = 404;
  /**
   * Returns urls that are used in the tool
   * @returns {Bool} The requested url
   */
  const urls = {
    soapApi: (baseUrl) => {
      return `${baseUrl}/api/soap/mantisconnect.php`;
    },

    edditTicket: (baseUrl, ticketId) => {
      return `${baseUrl}/view.php?id=${ticketId}`;
    },

    viewTicket: (baseUrl, ticketId) => {
      return `${baseUrl}/bug_update_page.php?bug_id=${ticketId}`;
    },
    all: (baseUrl, ticketId) => {
      return {
        soapApi: this.soapApi(baseUrl),
        edditTicket: this.edditTicket(baseUrl, ticketId),
        viewTicket: this.viewTicket(baseUrl, ticketId)
      };
    }
  };

  /**
   * checks if the user is able to log in the bugtracker This function is a prommise
   * @param   {String, String, String}  This are the paramse
   * @returns {Bool} of a Error when there is something wrong
   */
  const  login = (url, userName, password) => {
    return new Promise((resolve, reject) => {
      try {
        var pl = new SOAPClientParameters();
        pl.add('username', userName);
        pl.add('password', password);

        const apiUrl = urls.soapApi(url);
        SOAPClient.invoke(apiUrl, 'mc_login', pl, true, callBack);

         const callBack = (res) => {
          if (
            res.status === INTERNAL_SERVER_ERR ||
            res.status === NODATA_ERR ||
            res.status === NOTFOUND_ERR
          ) {
            reject({
              status: INTERNAL_SERVER_ERR,
              message: 'Your credentials are wrong'
            });
          } else {
            resolve(true);
          }
        }
      } catch (err) {
        log('error', `>-------------------: Error ${err.message}`, err);
        reject(err);
      }
    });
  }

  /**
   * Gets the projects that are listed in Manits
   * @param   {String, String, String}  This are the paramse
   * @returns {Array} It reutrns a array with the projects The object is seen below
   *
   *[{ name: {String},
   *   id: {Number}
   *}, ...]
   *
   */
  const getProjects = (url, userName, password) => {
    return new Promise((resolve, reject) => {
      try {
        var pl = new SOAPClientParameters();
        pl.add('username', userName);
        pl.add('password', password);

        const apiUrl = urls.soapApi(url);
        SOAPClient.invoke(
          apiUrl,
          'mc_projects_get_user_accessible',
          pl,
          true,
          callBack
        );

        const callBack = (res) => {
          if (res.status === INTERNAL_SERVER_ERR) {
            reject({
              status: INTERNAL_SERVER_ERR,
              message: 'Your credentials are wrong',
            });
          } else {
            // if there is only one project in mantis the api returns a object instead of a array
            if (res.item) {
              resolve([res.item]);
              return;
            }
            resolve(res);
          }
        };
      } catch (err) {
        log('error', `>-------------------: Error ${err.message}`, err);
        reject(err);
      }
    });
  }

  /**
   * Submits a new issue to mantis
   * @param   {String, String, String, String, object}  url, userName,
   *                                                    password, projecId, newTicketObject
   * @returns {Number} It returns the ticket id
   *
   */

  function submitIssue(url, userName, password, projecId, newTicketObject) {
    return new Promise((resolve, reject) => {
      try {
        var pl = new SOAPClientParameters();

        // account data
        pl.add('username', userName);
        pl.add('password', password);

        const IMPORTANT_WEIGHT = 40;
        const NOMAL_WEIGHT = 30;

        const ticket = {
          project: {
            id: projecId,
          },
          summary: newTicketObject.ticketTitle,
          description: newTicketObject.ticketText,
          platform: `${newTicketObject.data.browserData.browserName} ${
            newTicketObject.data.browserData.browserVersion
          }`,
          os: newTicketObject.data.browserData.os,
          os_build: newTicketObject.data.browserData.osversion,
          priority: {
            id:
              newTicketObject.isImportant === true
                ? IMPORTANT_WEIGHT
                : NOMAL_WEIGHT,
            name: newTicketObject.isImportant === true ? 'height' : 'normal'
          },
          steps_to_reproduce: JSON.stringify(newTicketObject.data),
          category: 'General' // This one is requert by mantis.
          // attachments: newTicketObject.assets
        };

        // Ticket data
        pl.add('issue', ticket);

        const apiUrl = urls.soapApi(url);
        SOAPClient.invoke(apiUrl, 'mc_issue_add', pl, true, callBack);

        const callBack = (ticketId) => {
          if (ticketId.status === INTERNAL_SERVER_ERR) {
            reject({
              status: INTERNAL_SERVER_ERR,
              message: 'Your credentials are wrong',
            });
          } else {
            uploadAssets(
              userName,
              password,
              apiUrl,
              ticketId,
              newTicketObject.assets,
            ).then(() => {
              resolve(ticketId);
            }).catch((err) => {
              log('error', err);
            });
          }
        };
      } catch (err) {
        log('error', `>-------------------: Error ${err.message}`, err);
        reject(err);
      }
    });
  }

  /**
   * Submits a new issue to mantis
   * @param   {String, String, String, String, object}  userName, password, apiUrl, issueId, assets
   * @returns {Number} It returns the
   *
   */

  function uploadAssets(userName, password, apiUrl, issueId, assets) {
    function callBack(data) {
      log('info', `>-----: the id of the asset is ${data}`);
      return data;
    }

    return new Promise((resolve, reject) => {
      try {
        assets.map((asset) => {
          const pl = new SOAPClientParameters();

          // account data
          pl.add('username', userName);
          pl.add('password', password);
          pl.add('issue_id', issueId);
          pl.add('name', asset.name);
          pl.add('file_type', asset.file_type);
          pl.add('content', asset.content);

          SOAPClient.invoke(
            apiUrl,
            'mc_issue_attachment_add',
            pl,
            true,
            callBack,
          );
        });

        resolve(true);
      } catch (err) {
        log('error', `>-------------------: Error ${err.message}`, err);
        reject(err);
      }
    });
  }

  return {
    urls,
    login,
    getProjects,
    submitIssue,
  };
})();

export default mantisApi;