'use strict';

/* Setup ==================================================================== */
import React, {Component} from 'react';

//Component
import Input from '../inputText/inputText';
import Loader from '../loader/loader';

//general funcions
import ext from '../../utils/ext';
import helpers from '../../utils/helpers'
import generalData from '../../config/general';

//helpers
import message from '../../utils/message';
import routerHelper from '../router/routerHelper';

/* Component ==================================================================== */
class Setup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isNewProject: true,
      onFinish: () => {},
      tools: [ //TODO: Get tools from background script
        {
          name: 'Mantis',
          value: 'mantis'
        }, {
          name: 'Github',
          value: 'github',
        },
        {
          name: 'Add to a existing project',
          value: 'existing'
        }
      ],
      projects: [],
      savedProjects: [],

      //pages
      page: 1, //the first page
      errorText: '',

      //loading states
      isLoading: false,
      loadingText: 'Loading...',

      //new values
      websiteUrl: window.location.hostname || 'localhost',
      savedProject: '',


      //TODO: change this vars;
      //tool states
      accountUserName: '',
      accountPassword: '',
      accountToken: '',
      toolProjectId: '',
      toolUrl: '',
      toolName: ''
    }
  }

  //get the saved sites and set it to the saved projects
  componentDidMount() {
    let _this = this;
    message.send('getStorage', 'savedSites').then(function(data) {
      _this.setState({savedProjects: data.savedSites});
    });
  }

//handle the change of a input field
  _handleStateChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  //save a projct
  _handleSavedProject = (e) => {
    let newFileList = this.state.savedProjects.filter(function(project) {
      if (project.id === e.target.value) {
        return project;
      }
    });

    this.setState({
      [e.target.name]: e.target.value,
      toolUrl: newFileList[0].tool.url,
      accountUserName: newFileList[0].account.passWord,
      accountPassword: newFileList[0].account.userName,
      accountToken: newFileList[0].account.token,
      toolName: newFileList[0].tool.name
    });
  }


  //check the credentials from the user
  _checkCredetionals = () => {
    let _this = this;
    if (this.state.accountUserName.length < 2 && this.state.accountPassword.length < 2 && this.state.toolUrl.length < 2) {
      this._setError('Not all the fields are filled.');
      //not everu field is filed in.
    } else {
      //set a loading element
      this._setLoading(`Checking you credentials, and logging in at ${this.state.toolName}.`);

      //send to the background script
      message.send('checkLogin', {
        url: this.state.toolUrl,
        tool: this.state.toolName,
        userName: this.state.accountUserName,
        password: this.state.accountPassword
      }).then(function(res) {

        //when the data is deined the request is gone the goud way
        if (res.data !== undefined) {
          _this.setState({projects: res.data.projectData});
          //TODO: filter the projects on access right

          //go the the next step
          setTimeout(function() {
            _this._nextStep(3);
          }, 500);

        } else {

          //show a error when the login fials
          _this._setError(res.error.message);
        }

      }).catch(function(error) {
        console.error('error', error);

        //show the error in the app
        _this._setError(error.message);

      });
    }
  }

  //the first stpe submit
  _selectBugtracker = (e) => {
    e.preventDefault();
    if (this.state.toolName.length < 1) {
      this._setError('Please select a Bugtacker');

    } else if (this.state.toolName === 'existing') { //check if the user chooses a existing login. If this happens go to the 3th step.
      this._nextStep(3);
    } else { //the user chooses a new tool.
      this._nextStep(2);
    }
  }

  //the second step
  _setProject = (e) =>{
      let _this = this;
      this._setLoading('Saving credentials.');

      setTimeout(function() {
        _this._nextStep(4);
      }, 2000);

      //save the ticket
      let {
        accountUserName,
        accountPassword,
        accountToken,
        toolUrl,
        toolName,
        toolProjectId
      } = this.state;

      let locationOrigin = generalData.hostname;

      //send to the background script
      message.send('setSite', {
        accountUserName,
        accountPassword,
        accountToken,
        toolUrl,
        toolName,
        toolProjectId,
        locationOrigin
      }).then(function (data) {
        console.log(data);
      });
  }

  /**
   *Go to the next page
   * @param   {Number}  the number of the page
   */
  _nextStep = (nextPage) => {
    this.setState({page: nextPage, isLoading: false, errorText: ''});
  }

  /**
   *Set the loading of the app
   * @param   {String}  the loading text
   */
  _setLoading = (loadingText) => {
    let setIsLoading = !this.state.isLoading; //toggle loading
    this.setState({isLoading: setIsLoading, loadingText: loadingText, errorText: ''});
  }

    /**
     *Set the error
     * @param   {String}  the error text
     */
  _setError = (errorText) => {
    this.setState({errorText: errorText, isLoading: false});
  }

    /**
     * GO one step back
     * @param   {String}  the error text
     */
  _prevStep = (e) => {
    let prevPage = this.state.page - 1; // this step -1;
    this.setState({page: prevPage});

    //do not submit the form
    e.preventDefault();

  }
    /**
     * Close the seteup
     * @param   {Bool}  True of false to open or not show the tour
     */
  _closeSetup = (showTour) => {
    this.props.onFinish(showTour);
  }

  /**
   * RENDER
  ***/

  _renderTools = () => {

    var options = this.state.tools.map((tool, index) => {
      return (
        <li key={index}>
          <input name="toolName" value={tool.value}  id={`toolName-${tool.name}`} checked={(this.state.toolName === tool.value)} type="radio" className="ln-radio" onChange={this._handleStateChange} onBlur={this._checkValue}/>
          <label htmlFor={`toolName-${tool.name}`}>{tool.name}</label>
        </li>
      );
    });

    return (
      <div className="ln-radio--wrapper">
        <ul id="radio-radio-field">
          {options}
        </ul>
      </div>
    );
  }

  _renderProjectSelect = () => {
    if (this.state.toolName === 'existing') {
      var savedProjects = this.state.savedProjects.map((option, index) => {
        return (
          <option key={index} value={option.id}>{option.tool.project}
            &#8203; in {option.tool.name}</option>
        );
      });

      return (
         <div className="ln-select--wrapper ln-icon ln-icon-select">
            <select onChange={this._handleSavedProject} name={'savedProject'}>
              <option value={null}>Choose project</option>
              {savedProjects}
            </select>
        </div>
      );
    }


    var projectOptions = this.state.projects.map((project, index) => {
      return (
        <option key={index} name={'website'} value={project.id}>{project.name}</option>
      );
    });

    return (
      <div className="ln-select--wrapper ln-icon ln-icon-select">
        <select value={this.state.toolProjectId} name="toolProjectId" onChange={this._handleStateChange}>
          <option value={null}>Choose project</option>
          {projectOptions}
        </select>
      </div>
    );
  }

  _renderForm = () => {

    if (this.state.isLoading === true) {
      return (
        <Loader color={'blue'} loadingText={this.state.loadingText}></Loader>
      )
    }
    if (this.state.page === 1) {
      return (
        <form onSubmit={this._selectBugtracker.bind(this)}>
          <div>
            <h1>Choose your bugtracker</h1>
            <p>This is the first time that you open Layernotes on this webiste. Please connect this site to a bugtracker. Or add it to a existing project.</p>
            <div>
              {this._renderTools()}
            </div>
          </div>
          <div className="ln-button--wrapper">
            <div></div>
            <button className={'ln-btn ln-btn-primary'}>
              Next step
            </button>
          </div>
        </form>
      );
    } else if (this.state.page === 2) {
      return (
        <form onSubmit={this._checkCredetionals.bind(this)}>

          <div>
            <h1>Bugtracker settings</h1>
            <p>Please fill in your bugtracker credentials, so Layernotes can connect with your account.</p>
            <Input label={`${this.state.toolName} url`} helperText={'This is the url witch you use to access your bugtracker'} type="url" name="toolUrl" placeholder="https://bugtracker.uncinc.nl" value={this.state.toolUrl} onchange={this._handleStateChange}/>
            <Input label={'Username'} type="text" helperText={'This is the user name you use to login in your bugtracker'} name="accountUserName" placeholder="info@uncinc.nl" value={this.state.accountUserName} onchange={this._handleStateChange}/>
            <Input label={'Password'} type="password" helperText={'This is the password you use to login in your bugtracker'} name="accountPassword" placeholder="Password" value={this.state.accountPassword} onchange={this._handleStateChange}/>
          </div>
          <div className="ln-button--wrapper">
            <button className={'ln-btn ln-btn-secondary'} onClick={this._prevStep}>
              Previous step
            </button>
            <button className={'ln-btn ln-btn-primary'}>
              Next step
            </button>
          </div>
        </form>
      );
    } else if (this.state.page === 3) {
      return (
        <form onSubmit={this._setProject.bind(this)}>
          <div>
            <h1>Choose the project that this webiste belongs to.</h1>
            {this._renderProjectSelect()}
          </div>
          <div className="ln-button--wrapper">
            <button className={'ln-btn ln-btn-secondary'} onClick={this._prevStep}>
              Previous step
            </button>
            <button className={'ln-btn ln-btn-primary'}>
              Next step
            </button>
          </div>
        </form>
      );
    } else if (this.state.page === 4) {
      return (
        <div>
          <h1>
            {this.state.websiteUrl}&#8203; is added to your project.
          </h1>
          <p>
            When this is your first time you can start a tutorial.
          </p>
          <div className={'ln-center'}>
            <span className={'ln-icon ln-icon-succes'}></span>
          </div>
          <div className="ln-button--wrapper">
            <button className={'ln-btn ln-btn-primary'} onClick={() => this._closeSetup(true)}>Start tutorial</button>
            <button className={'ln-btn ln-btn-primary'} onClick={() => this._closeSetup(false)}>Finish</button>
          </div>
        </div>
      );
    }
  }
  _renderSteps = () => {
    return (
      <div className={'ln-setup-aside--numbers'}>
        <span data-count="1" title="Select bugtracker" className={`ln-setup-aside--number ${ + (this.state.page >= 1)
          ? 'ln-active'
          : ''}`}>1</span>
        <span data-count="2" title="Log in bugtracker" className={`ln-setup-aside--number ${ + (this.state.page >= 2)
          ? 'ln-active'
          : ''}`}>2</span>
        <span data-count="3" title="Select project" className={`ln-setup-aside--number ${ + (this.state.page >= 3)
          ? 'ln-active'
          : ''}`}>3</span>
        <span data-count="4" title="Finish" className={`ln-setup-aside--number ${ + (this.state.page >= 4)
          ? 'ln-active'
          : ''}`}>4</span>
      </div>
    );
  }
  _renderMainError = () => {
    if (this.state.errorText.length > 1) {
      return (
        <section className={'ln-setup-error'}>
          <p>{this.state.errorText}</p>
        </section>
      )
    }
    return '';
  }

  render = () => {
    return (
      <div className={'ln-setup--background'}>
        <section className={'ln-setup'}>
          <aside>
            {this._renderSteps()}
          </aside >
          {this._renderMainError()}
          <section className={'ln-setup-content'}>
            {this._renderForm()}
          </section>
        </section>
      </div>
    );
  }
};

/* Export Component ==================================================================== */
export default Setup;