import React from 'react';
import DeepSea from './../../../assets/DeepSea.svg';

export class LoginPage extends React.Component {
  
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
    const logoPanel = this.getLogoPanel();
    const loginContainer = React.createElement('div', { className: ' login-container' },
      logoPanel,
    )

    return loginContainer;
  }

  getLogoPanel() {
    return (
      <div class="logo-container">
        <img src={DeepSea} className="img-logo" alt="Deep Sea" />
      </div>
    );
  }
}
