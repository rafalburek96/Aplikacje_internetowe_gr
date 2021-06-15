import React, {Component} from 'react';
import './App.css';
import {BrowserRouter} from "react-router-dom";
import routes, {PageLayout} from "../router";

export default class App extends Component
{
  render() {
    return (
        <BrowserRouter>
          <React.Fragment>
              {PageLayout}
            <div id={"main-container"}>{routes}</div>
          </React.Fragment>
        </BrowserRouter>
    );
  }
}

App.propTypes = {};