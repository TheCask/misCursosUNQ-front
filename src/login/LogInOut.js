import React from 'react';
import { Button, UncontrolledTooltip } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const config = require('./authConfig');

export default class LogInOut extends React.Component {

  render() {
    let message = (this.props.body.token) ? 'Sign Out' : 'Sign In';

    let path = (this.props.body.token) ? '/logout' : '/login';

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