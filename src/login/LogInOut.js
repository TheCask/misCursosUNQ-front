import React from 'react';
import { Button, UncontrolledTooltip } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as AuthAPI from '../services/AuthAPI';
import AppSpinner from '../AppSpinner';
import Log from '../Log'

const config = require('./authConfig');

export default class LogInOut extends React.Component {

  constructor(props) {
    super(props);
    this.state = {isErrorModalOpen: true, 
      lastError: {title: "", description: "", error: null},
      body: {}, isLoading: true};
    this.toggle = this.toggleErrorModal.bind(this);
    this.props = props;
  }

  async componentDidMount() {
    AuthAPI.getAppUserByIdAsync(json => this.setState({body: json, isLoading: false}), 
      this.showError("get app user"));
  }

  showError(title, description, error){
    this.setState({isErrorModalOpen: true, 
      lastError: {title: "", description: "", error: null}});
  }

  toggleErrorModal() {
    this.setState({isErrorModalOpen: !this.state.isErrorModalOpen});
  }

  render() {
    if (this.state.isLoading) { return (<AppSpinner/>) }
    let appUser = this.state.body;
    let message = (appUser.token) ? 'Sign Out' : 'Sign In';
    let path = (appUser.token) ? '/logout' : '/login';
    return (
    <Button href={`http://localhost:${config.serverPort}` + path} outline color="light" id="signInOut">
      <UncontrolledTooltip placement="auto" target="signInOut">
        {message}
      </UncontrolledTooltip>
      {message === 'Sign Out' ? 
      <FontAwesomeIcon icon='sign-out-alt' size="1x" color="darkred" /> : 
      <FontAwesomeIcon icon='sign-in-alt' size="1x" color="darkgreen" />}
    </Button>
    )
  }
}