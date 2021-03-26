import React from 'react';

import './home.page.css';
import { CardContainer } from '../../libs/container/card-container/card-container';
import {
  Link
} from "react-router-dom";

export class HomePage extends React.Component {

  render() {
    // left container includes the connection or router to other application or feature;
    // included category like games and game... Or AI, Technical, Article,... some features we supports

    // Right container is reported like best feature or recommended feature or best used features
    // right container include private route as login
    return (
      <div className="home-container">
        <div className="left-container">
          <CardContainer></CardContainer>
        </div>
        <div className="right-container">
          <div className="private-routing">
            <div className="routing-item"><Link className="link" to="/login"> Sign-In </Link></div>
            <div className="routing-item"> <Link className="link" to="/"> Registry </Link> </div>
            <div className="routing-item"> <Link className="link" to="/"> ? About Us </Link> </div>
          </div>
        </div>
      </div>
    );
  }
}