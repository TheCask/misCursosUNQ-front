import React  from 'react';
import { Button, UncontrolledTooltip, Media } from 'reactstrap';
import {userContext} from './UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ComponentWithErrorHandling from '../errorHandling/ComponentWithErrorHandling';

export default class Greeting extends ComponentWithErrorHandling {

  render() {
    return (
      <userContext.Consumer>
        { value => { 
          let user = value.globalUser;
          return (
            user ? <ProfileButton greeting={user.username ? user.username : user.email}
              avatar={user.imageUrl ? user.imageUrl : <FontAwesomeIcon icon='id-card' size="lg" /> } />
              : ""
            )
          }
        }
      </userContext.Consumer>
    )
  }
}

const ProfileButton = (props) => {
  return (
        <Button block size="lg" color="rgba(20, 0, 0, 0.40)" href={'/profile'} id="profile">
          <Media width="32" object src={props.avatar} alt="User Avatar" />
          {" "}
          {JSON.stringify(props.greeting).replace(/["]/g,"")}
          <UncontrolledTooltip placement="auto" target="profile">
            Edit Profile
          </UncontrolledTooltip>
        </Button>
  )
}