import React  from 'react';
import { CustomInput, FormGroup, Form, Label } from 'reactstrap';
import {userContext} from './UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ComponentWithErrorHandling from '../errorHandling/ComponentWithErrorHandling';
import Log from '../Log';

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
          let roles = user ? user.roles.concat(['Guest']) : ['Guest'];
          return (
            user ?
            <Form inline>
            <FormGroup>
            <Label for="rol" className="mr-sm-2">Rol</Label>
            <CustomInput style={{backgroundColor:"rgba(155, 155, 155, 0.5)", color:"black"}} type="select" name="rol" id="rol" label="Rol" 
              value={value.actualRol || ''} onChange={ () => { value.chooseRol(document.getElementById("rol").value); } }>
                {this.rolesOptions(roles)}
            </CustomInput>
            </FormGroup>
            </Form>
            : "")
          }
        }
      </userContext.Consumer>
    )
  }
}