import React from 'react';
import { Button, UncontrolledTooltip } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {userContext} from './UserContext';
import ComponentWithErrorHandling from '../errorHandling/ComponentWithErrorHandling';

const config = require('./authConfig');
//onClick={user ? localStorage.setItem('rol', '') : value.actualRol}
export default class LogInOut extends ComponentWithErrorHandling {

  render() {
    return (
      <userContext.Consumer>
        { value => { 
          let user = value.appUser;
          let message = (user) ? 'Sign Out' : 'Sign In';
          let path = (user) ? '/logout' : '/login';
          return (
            <Button size="lg" color="rgba(20, 0, 0, 0.40)" id="signInOut"
              href={`http://localhost:${config.serverPort}` + path} >
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
      </userContext.Consumer>
    )
  }
}