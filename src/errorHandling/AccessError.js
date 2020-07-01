import React, { Component } from 'react';
import { Jumbotron } from 'reactstrap';
import AppNavbar from '../AppNavbar';

export default class LogInOut extends Component {

  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    let errorCode = this.props.errorCode;
    let errorDetail = this.props.errorDetail;
    return (
      <div>
      <AppNavbar>
      <Jumbotron>
        <h1 className="display-3">Ups... something went wrong!</h1>
        <p className="lead">{errorCode}</p>
        <hr className="my-2" />
        <p>{errorDetail}</p>
        <p className="lead"></p>
      </Jumbotron>
      </AppNavbar>
    </div>
    )
  }
}