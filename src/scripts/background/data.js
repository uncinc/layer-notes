'use-strict';

// import helpers
import helpers, { log } from '../utils/helpers';
import storage from '../utils/storage';
import ext from '../utils/ext';

// get all the user data sutch as browser
import findUserData from './findUserData';
import generalData from '../config/general';
import mantisApi from './mantisApi';

/* Component ==================================================================== */
const data = (() => {
  // check if the storage item exists and when not add a empty array;
  function setUpStorage() {
    getStorage('savedTickets').then((data) => {
      if (data.savedTickets === undefined || data.savedTickets.length === 0) {
        setStorage({
          savedTickets: [],
        });
      }
    });
    getStorage('savedSites').then((data) => {
      if (data.savedSites === undefined || data.savedSites.length === 0) {
        setStorage({
          savedSites: [],
        });
      }
    });
  }

  // returns a list or the urls
  function getUrls(params) {
    const { hostname, ticketId } = params;
    return new Promise(((resolve, reject) => {
      try {
        getStorage('savedSites')
          .then((data) => {
            // find out witch api this site uses;
            const siteData = data.savedSites.filter((obj) => {
              if (obj.urls.indexOf(hostname) > -1) {
                return obj;
              }
            });
            // return the first object in the array
            return siteData[0];
          })
          .then((siteData) => {
            const urls = mantisApi.urls.all(siteData.tool.url, ticketId);
            resolve(urls);
          });
      } catch (err) {
        log('error',`>-------------------: Error ${err.message}`, err);
        reject(err);
      }
    }));
  }

  // clean all tickets an user acount data;
  function cleanAll() {
    log('info', '>-------- The app is cleaned');
    setStorage({
      savedTickets: [],
      savedSites: [],
    });
  }

  // genreal funcitons
  function getStorage(key) {
    return new Promise(((resolve, reject) => {
      try {
        storage.get(key, (sites) => {
          resolve(sites);
        });
      } catch (err) {
        log('error', `>-------------------: Error ${err.message}`, err);
        reject(err);
      }
    }));
  }

  function setStorage(value) {
    return new Promise(((resolve, reject) => {
      try {
        storage.set(value, (sites) => {
          resolve(sites);
        });
      } catch (err) {
        log('error', `>-------------------: Error ${err.message}`, err);
        reject(err);
      }
    }));
  }

  // login to mantisApi
  function checkLogin(params) {
    return new Promise(((resolve, reject) => {
      try {
        const { url, userName, password } = params;

        mantisApi
          .login(url, userName, password)
          .then((userData) => {
            if (userData === true) {
              mantisApi
                .getProjects(url, userName, password)
                .then((projectsData) => {
                  resolve({
                    validUser: userData,
                    projectData: projectsData,
                  });
                })
                .catch((err) => {
                  reject(err);
                });
            } else {
              reject({
                status: 500,
                message: 'Your credentials are wrong.',
              });
            }
          })
          .catch((err) => {
            reject(err);
          });
      } catch (err) {
        log('error', `>-------------------: Error ${err.message}`, err);
        reject(false);
      }
    }));
  }

  function isFirstTime(params) {
    return new Promise(((resolve, reject) => {
      try {
        getStorage('savedSites').then((data) => {
          if (data.savedSites.length > 0) {
            const isFirstTime = data.savedSites.some((obj) => {
              if (obj.urls.indexOf(params.hostname) > -1) {
                return true;
              }
            });
            resolve(isFirstTime);
          } else {
            resolve(false);
          }
        });
      } catch (err) {
        log('error', `>-------------------: Error ${err.message}`, err);
        reject(false);
      }
    }));
  }

  function getTicketsFromPage(params) {
    return new Promise(((resolve, reject) => {
      try {
        getStorage('savedTickets')
          .then((tickets) => {
            const filtertTickets = tickets.savedTickets.filter((ticket) => {
              // if the url form this page is the same as the saved url
              if (params.url === ticket.data.url) {
                return ticket;

                // when de shortLink is not null (null is used when it's not defined on the website) and the shortlink is the same in the database;
              } else if (
                params.shortlink !== null &&
                params.shortlink === ticket.data.shortlink
              ) {
                return ticket;
              }
            });
            const amountTicketsOnWebsite = tickets.savedTickets.filter((ticket) => {
              if (params.hostname === ticket.data.hostname) {
                return ticket;
              }
            });
            resolve({
              filtertTickets,
              filtertTicketsAmout: filtertTickets.length,
              allTicketsFromThisWebsite: amountTicketsOnWebsite,
              allTicketsFromThisWebsiteAmount: amountTicketsOnWebsite.length,
            });
          })
          .catch((err) => {
            reject(err);
            log('error', `>-------------------: Error ${err.message}`, err);
          });
      } catch (err) {
        log('error', `>-------------------: Error ${err.message}`, err);
        reject(err);
      }
    }));
  }

  function setSite(params) {
    const {
      accountUserName,
      accountPassword,
      accountToken,
      toolUrl,
      toolName,
      toolProjectId,
      locationOrigin,
    } = params;
    return new Promise(((resolve, reject) => {
      try {
        getStorage('savedSites').then((data) => {
          const urls = [];
          urls.push(locationOrigin);
          const siteObject = {
            urls,
            id: helpers.generateUUID(),
            account: {
              userName: accountUserName,
              passWord: accountPassword,
              token: accountToken,
            },
            tool: {
              project: toolProjectId,
              url: toolUrl,
              name: toolName,
              id: helpers.generateUUID(),
            },
          };
          data.savedSites.push(siteObject);
          // save the sites in the database
          storage.set({
            savedSites: data.savedSites,
          });
          resolve(siteObject);
        });
      } catch (err) {
        log('error', `>-------------------: Error ${err.message}`, err);
        reject(err);
      }
    }));
  }

  // var newTicket = {
  //   id: 'asdfdasf-asdfsadf-asdfasdf',
  //   data: {}, //dataobject with all browser settings
  //   ticketText: '',
  //   isImportant: false,
  //   assets: [],
  //   position: {
  //     x: 0,
  //     y: 0,
  //     width: 0,
  //     height: 0
  //   }
  // };

  function submitNewTicket(params) {
    const {
      ticket, hostname, url, shortlink,
    } = params;

    return new Promise(((resolve, reject) => {
      try {
        // Get the savedSites and check withs API this site uses;
        getStorage('savedSites')
          .then((data) => {
            // find out witch api this site uses;
            const siteData = data.savedSites.filter((obj) => {
              if (obj.urls.indexOf(hostname) > -1) {
                return obj;
              }
            });
            // return the first object in the array
            return siteData[0];
          })
          .then((siteData) => {
            const newTicketObject = {
              data: findUserData.specificUserData(
                hostname,
                url,
                shortlink,
                ticket.data.screenresolution,
              ), // dataobject with all browser settings
              ticketText: ticket.ticketText,
              ticketTitle: helpers.shortText(ticket.ticketText),
              isImportant: ticket.isImportant,
              assets: ticket.assets,
              position: ticket.position,
            };
            // Send the data to the manais API with the right data;
            mantisApi
              .submitIssue(
                siteData.tool.url,
                siteData.account.userName,
                siteData.account.passWord,
                siteData.tool.project,
                newTicketObject,
              )
              .then((submittedTicketId) => {
                saveNewTicket(
                  hostname,
                  newTicketObject,
                  submittedTicketId,
                ).then((newTicket) => {
                  resolve(newTicket);
                });
              })
              .catch((err) => {
                reject(err);
              });
          })
          .catch((err) => {
            reject(err);
          });
      } catch (err) {
        log('error', `>-------------------: Error ${err.message}`, err);
        reject(false);
      }
    }));
  }

  function saveNewTicket(hostname, newTicketObject, id) {
    return new Promise(((resolve, reject) => {
      try {
        getStorage('savedTickets')
          .then((dataobject) => {
            newTicketObject.id = id;
            newTicketObject.assets.map((asset) => {
              asset.content = '';
              return asset;
            });
            dataobject.savedTickets.push(newTicketObject);
            return dataobject;
          })
          .then((dataobject) => {
            setStorage(dataobject);
            resolve(dataobject);
          })
          .catch((err) => {
            log('error', `>-------------------: Error ${err.message}`, err);
          });
      } catch (err) {
        log('error', `>-------------------: Error ${err.message}`, err);
        reject(err);
      }
    }));
  }

  function updateTicket(params) {
    const { ticket } = params;

    return new Promise(((resolve, reject) => {
      try {
        getStorage('savedTickets')
          .then((dataobject) => {
            const AllTicketsWithoutTheTicketToUpdate = dataobject.savedTickets.filter((allTicket) => {
              if (allTicket.id !== ticket.id) {
                return allTicket;
              }
            });
            dataobject.savedTickets = AllTicketsWithoutTheTicketToUpdate;
            ticket.ticketTitle =
              `${helpers.cut(
                ticket.ticketText.replace(
                  '/(issues)|(thes)|(sites)|(websites)|(ins)|(ons)|(pages)|(tos)/g',
                  '',
                ),
                generalData.maxLetters,
              )}...`;
            dataobject.savedTickets.push(ticket);
            return dataobject;
          })
          .then((dataobject) => {
            setStorage(dataobject);
            resolve(dataobject);
          })
          .catch((err) => {
            log('error', `>-------------------: Error ${err.message}`, err);
          });
      } catch (err) {
        log('error', `>-------------------: Error ${err.message}`, err);
        reject(err);
      }
    }));
  }

  const takeScreenschot = () => {
    return new Promise(((resolve, reject) => {
      try {
        // get the  current open tab
        ext.windows.getCurrent((window) => {
          // create a screenshot
          ext.tabs.captureVisibleTab(
            window.id,
            {
              format: 'jpeg', // this could also be PNG.
            },
            (image) => {
              resolve(image.split(',')[1]); // get only the data not the type;
            },
          );
        });
      } catch (err) {
        log('error', `>-------------------: Error ${err.message}`, err);
        reject(err);
      }
    }));
  };

  function init() {
    setUpStorage();
    // cleanAll();
  }

  return {
    checkLogin,
    init,
    getUrls,
    getTicketsFromPage,
    isFirstTime,
    setSite,
    getStorage,
    submitNewTicket,
    updateTicket,
    takeScreenschot,
  };
})();

//* Export  ==================================================================== */
export default data;