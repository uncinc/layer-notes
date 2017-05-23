import {
  SOAPClient,
  SOAPClientParameters
} from '../vendor/soapclient';

/* Component ==================================================================== */
let mantisApi = (() => {
  const mantisSoapUrl = '/api/soap/mantisconnect.php'

  /**
   * checks if the user is able to log in the bugtracker This function is a prommise
   * @param   {String, String, String}  This are the paramse
   * @returns {Bool} of a Error when there is something wrong
   */
  function login(url, userName, password) {
    return new Promise(function (resolve, reject) {
      try {
        var pl = new SOAPClientParameters();
        pl.add('username', userName);
        pl.add('password', password);

        const apiUrl = url + mantisSoapUrl;
        SOAPClient.invoke(apiUrl, 'mc_login', pl, true, callBack);

        function callBack(res) {
          const FATAL_ERR = 500;
          if (res.status === FATAL_ERR) {
            reject({
              status: FATAL_ERR,
              message: 'Your credentials are wrong'
            });
          } else {
            resolve(true);
          }
        }

      } catch (err) {
        console.error(`>-------------------: Error ${err.message}`, err);
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
  function getProjects(url, userName, password) {
    return new Promise(function (resolve, reject) {
      try {
        var pl = new SOAPClientParameters();
        pl.add('username', userName);
        pl.add('password', password);

        const apiUrl = url + mantisSoapUrl;
        SOAPClient.invoke(apiUrl, 'mc_projects_get_user_accessible', pl, true, callBack);

        function callBack(res) {

          if (res.status === 500) {
            reject({
              status: 500,
              message: 'Your credentials are wrong'
            });
          } else {
            resolve(res);
          }
        }

      } catch (err) {
        console.error(`>-------------------: Error ${err.message}`, err);
        reject(err);
      }
    });
  }

  /**
   * Submits a new issue to mantis
   * @param   {String, String, String, String, object}  url, userName, password, projecId, newTicketObject
   * @returns {Number} It returns the ticket id
   *
   */

  function submitIssue(url, userName, password, projecId, newTicketObject) {
    return new Promise(function (resolve, reject) {
      try {
        var pl = new SOAPClientParameters();

        //account data
        pl.add('username', userName);
        pl.add('password', password);

        let ticket = {
          project: {
            id: projecId
          },
          summary: newTicketObject.ticketTitle,
          description: newTicketObject.ticketText,
          platform: `${newTicketObject.data.browserData.browserName} ${newTicketObject.data.browserData.browserVersion}`,
          os: newTicketObject.data.browserData.os,
          os_build: newTicketObject.data.browserData.osversion,
          priority: {
            id: (newTicketObject.isImportant === true) ? 40 : 30,
            name: (newTicketObject.isImportant === true) ? 'height' : 'normal',
          },
          steps_to_reproduce: JSON.stringify(newTicketObject.data),
          category: 'General', //This one is requert by mantis.
          // attachments: newTicketObject.assets
        };

        //Ticket data
        pl.add('issue', ticket);

        const apiUrl = url + mantisSoapUrl;
        SOAPClient.invoke(apiUrl, 'mc_issue_add', pl, true, callBack);

        function callBack(ticketId) {

          if (ticketId.status === 500) {
            reject({
              status: 500,
              message: 'Your credentials are wrong'
            });
          } else {
            uploadAssets(userName, password, apiUrl, ticketId, newTicketObject.assets).then(function () {

              resolve(ticketId);
            }).catch(function (err) {
              console.log(err);
            });
          }
        }

      } catch (err) {
        console.error(`>-------------------: Error ${err.message}`, err);
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
      console.log(`>-----: the id of the asset is ${data}`);
    }

    return new Promise(function (resolve, reject) {
      try {

        assets.map(function (asset) {
          var pl = new SOAPClientParameters();

          //account data
          pl.add('username', userName);
          pl.add('password', password);
          pl.add('issue_id', issueId);
          pl.add('name', asset.name);
          pl.add('file_type', asset.file_type);
          pl.add('content', asset.content);

          SOAPClient.invoke(apiUrl, 'mc_issue_attachment_add', pl, true, callBack);
        });

        resolve(true);

      } catch (err) {
        console.error(`>-------------------: Error ${err.message}`, err);
        reject(err);
      }
    });
  }

  return {
    login,
    getProjects,
    submitIssue
  };

})();



export default mantisApi;
