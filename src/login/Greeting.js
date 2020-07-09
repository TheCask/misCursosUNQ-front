import React  from 'react';
import { Button, UncontrolledTooltip, Media } from 'reactstrap';
import { userContext } from './UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ComponentWithErrorHandling from '../errorHandling/ComponentWithErrorHandling';
import * as Constants from '../auxiliar/Constants'
import * as AuxFunc from '../auxiliar/AuxiliarFunctions'

export default class Greeting extends ComponentWithErrorHandling {

  render() {
    return (
      <userContext.Consumer>
        { value => { 
          let user = value.globalUser;
          return ( !user ? <ProfileButton greeting={'User'} avatar={userRandomIcon()} />
            : <ProfileButton greeting={user.username ? user.username : user.email}
              avatar={user.imageUrl ? user.imageUrl : userRandomIcon() } />
          )
          }
        }
      </userContext.Consumer>
    )
  }
}

const ProfileButton = (props) => {
  if (props.greeting !== 'User') {
    return (  
      <Button size="lg" color="rgba(20, 0, 0, 0.40)" href={'/profile'} id="profile">
        <Media width="32" object src={props.avatar} alt="User Avatar" style={{marginRight:10}}/>
        {JSON.stringify(props.greeting).replace(/["]/g,"")}
        <UncontrolledTooltip placement="auto" target="profile">
          Edit Profile
        </UncontrolledTooltip>
      </Button>
    )
  }
  else {
    return (
      <Button size="lg" color="rgba(20, 0, 0, 0.40)" id="profile">
        {props.avatar}{props.greeting}
        <UncontrolledTooltip placement="auto" target="profile">
          Sign In to access your profile
        </UncontrolledTooltip>
      </Button>
    )
  }
}

const userRandomIcon = () => {
  let randomIndex = AuxFunc.getRandomInt(0, Constants.iconsList.length)
  return <FontAwesomeIcon color='darkred' icon={Constants.iconsList[randomIndex]} 
          size='lg' style={{marginRight:10}}/>
}