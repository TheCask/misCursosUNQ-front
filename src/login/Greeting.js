import React, {Component} from 'react';
import { Button, UncontrolledTooltip } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Log from '../Log'
import Container from 'reactstrap/lib/Container';

export default class Greeting extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let message = (this.props.body.registration)
      ? <ProfileButton registration={this.props.body.registration}/>
      : "";
    return (<span>{message}</span>);
  }
}

const ProfileButton = (props) => {
  return (
        <Button size="2x" color='light' outline href={'/profile'} id={"profile"}>
          <FontAwesomeIcon icon="id-card" size="lg"/>
          {" "}
          {JSON.stringify(props.registration.username).replaceAll("\"","")}
          <UncontrolledTooltip placement="auto" target="profile">
            Edit Profile
          </UncontrolledTooltip>
        </Button>
  )
}