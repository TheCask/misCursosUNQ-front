import React  from 'react';
import { Input } from 'reactstrap';
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

  handleChange(event) {
    let rol = event.target.value;
    return rol
  }

  render() {
    return (
      <userContext.Consumer>
        { value => {
          let user = (value.appUser) ? value.appUser : null;
          let roles = user ? user.roles.concat(['']) : [''];
          return (
            user ?
            <Input type="select" name="rol" id="rol" label="Rol" value={value.actualRol || ''}
              onChange={ () => { value.chooseRol(document.getElementById("rol").value); } }>
                {this.rolesOptions(roles)}
            </Input>
            : "")
          }
        }
      </userContext.Consumer>
    )
  }
}

            {/* //   <FormGroup>
            //       <Input type="select" name="rol" id="rol"  value={value.actualRol || ''}
            //             label="Rol">
            //         {roles}
            //       <FontAwesomeIcon icon='user-tag' size="xs" color="darkred" />
            //       </Input>
            //       <UncontrolledTooltip placement="auto" target="rol"> Select Rol </UncontrolledTooltip>
            //   </FormGroup>
            // : "") */}