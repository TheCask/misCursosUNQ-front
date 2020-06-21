import React from 'react';
import { Button, UncontrolledTooltip } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as AuthAPI from '../services/AuthAPI';
import AppSpinner from '../AppSpinner';
import ComponentWithErrorHandling from '../errorHandling/ComponentWithErrorHandling';

const config = require('./authConfig');

export default class LogInOut extends ComponentWithErrorHandling {

  constructor(props) {
    super(props);
    this.state = {isErrorModalOpen: true, 
      lastError: {title: "", description: "", error: null},
      body: {}, isLoading: true};
    this.props = props;
  }

  async componentDidMount() {
    AuthAPI.getAppUserByIdAsync(json => this.setState({body: json, isLoading: false}), 
      this.showError("get app user"));
  }

  render() {
    if (this.state.isLoading) { return (<AppSpinner/>) }
    let appUser = this.state.body;
    let message = (appUser.token) ? 'Sign Out' : 'Sign In';
    let path = (appUser.token) ? '/logout' : '/login';
    return (
    <Button size="lg" color="light" outline href={`http://localhost:${config.serverPort}` + path} id="signInOut">
      <UncontrolledTooltip placement="auto" target="signInOut">
        {message}
      </UncontrolledTooltip>
      {message === 'Sign Out' ? 
        <FontAwesomeIcon icon='sign-out-alt' size="lg" color="darkred" />
        : <FontAwesomeIcon icon='sign-in-alt' size="lg" color="darkgreen" />}
    </Button>
    )
  }
}