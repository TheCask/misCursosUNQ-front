import React from 'react';
import { Button, UncontrolledTooltip } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class LogInOut extends React.Component {
  constructor(props) {
    super(props);
  }


  render() {
    let message = (this.props.body.token) ? 'Sign Out' : 'Sign In';

    let path = (this.props.body.token) ? '/logout' : '/login';

    return (
    <Button href={this.props.uri + path} outline color="light" id="signInOut">
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