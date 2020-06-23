import React  from 'react';
import { CustomInput, FormGroup, Form, UncontrolledTooltip } from 'reactstrap';
import {userContext} from './UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ComponentWithErrorHandling from '../errorHandling/ComponentWithErrorHandling';

export default class Rol extends ComponentWithErrorHandling {

  rolesOptions(roles) {
    return ( roles.map(rl => {
      return (<option key={rl}>{rl}</option>) 
    })
    );
  }

  render() {
    return (
      <userContext.Consumer>
        { value => {
          let user = (value.appUser) ? value.appUser : null;
          let roles = user ? user.roles : ['Guest'];
          return (
            user ?
            <Form inline>
            <FormGroup>
            <FontAwesomeIcon color="darkred" icon='user-tag' size="lg" id="rolIcon" style={{marginRight:"10"}}/>
            <CustomInput style={{backgroundColor:"rgba(155, 155, 155, 0.4)", color:"black"}} type="select" name="rol" id="rol" label="Rol" 
              value={value.actualRol || ''} onChange={ () => { value.chooseRol(document.getElementById("rol").value); } }>
                {this.rolesOptions(roles)}
            </CustomInput>
            <UncontrolledTooltip placement="auto" target="rol">
              Select current Rol
            </UncontrolledTooltip>
            </FormGroup>
            </Form>
            : "")
          }
        }
      </userContext.Consumer>
    )
  }
}