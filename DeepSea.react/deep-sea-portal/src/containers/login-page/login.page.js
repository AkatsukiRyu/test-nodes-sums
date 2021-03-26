import React from 'react';
import DeepSea from './../../assets/DeepSea.svg';
import { Link } from 'react-router-dom';
import './login.page.css';
import * as environment from '../../environments/environments';

export class LoginPage extends React.Component {

  constructor() {
    super();
    this.state = {
      connected: false,
      user: null,
      error: null
    };
  }

  componentDidMount() {
    
  }

  login() {
    fetch(`${environment.localEnvironment.api}users/login`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
        'Access-Control-Allow-Headers': 'Content-Type, Accept'
      },
      body: {userName: '', password: ''} // get username and password to here and post to server.
    })
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            connected: true
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            connected: false,
          });
        }
      )
  }

  getLoginControllerPanel() {
    return (
      <div className="controller-panel">
        <div className="control-header align-center"> DEEP SEA </div>
        <div className="control-body align-center">
          <div className="control">
            <label className="label"> Username </label>
            <input className="ds-input" type="text" />
          </div>

          <div className="control">
            <div className="group-labels">
              <label className="label"> Password </label>
              <Link to="/#"> Forgot Password </Link>
            </div>
            <input className="ds-input" type="text" />
          </div>
        </div>

        <div className="control-footer">
          <div className="left">
            <Link to="/#"> Register? Don't have account yet </Link>
          </div>
          <div className="right">
            <button className="ds-btn ds-btn-confirm" onClick="login()"> Sign-In </button>
          </div>
        </div>
      </div>
    )
  }

  getLogoPanel() {
    return (
      <div className="logo-container">
        <img src={DeepSea} className="img-logo" alt="Deep Sea" />
      </div>
    );
  }

  getLoginContainerPanel() {
    const loginControllerPanel = this.getLoginControllerPanel();
    return (
      <div className="login-panel">
        { loginControllerPanel}
        <div className="notice">
          { this.state.connected ? 'Connected' : 'Not Connected'}
        </div>
      </div>
    )
  }

  /**
   * Login container has 2 sections
   * 1. Logo
   * 2. Login panel
   *   2.1 Login Header
   *   2.2 Login Controls => UserName and Password, Forgot password
   *   2.3: Login footer => Login Button or registries
   * @returns 
   */
  render() {
    const loginPanel = this.getLoginContainerPanel();
    const logoPanel = this.getLogoPanel();

    return (
    <div className="login-page">
      <div className="back">
        <Link to="/home"> Back To home </Link>
      </div>
      { logoPanel }
      {loginPanel}
    </div>);
  }

}
