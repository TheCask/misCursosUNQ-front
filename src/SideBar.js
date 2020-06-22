import React, {Component} from 'react';
import { Navbar, Nav, NavItem, NavLink } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {userContext} from './login/UserContext';

const sidebarItems = [
  {name: 'Home', link: '/', icon: 'home', restrictedTo:['', 'Teacher', 'Cycle Coordinator'] },
  {name: 'Courses', link: '/courses', icon: 'chalkboard', restrictedTo:['Teacher', 'Cycle Coordinator']},
  {name: 'Users', link: '/users', icon: 'chalkboard-teacher', restrictedTo:['Cycle Coordinator']},
  {name: 'Subjects', link: '/subjects', icon: 'university', restrictedTo:['Cycle Coordinator']},
  {name: 'Students', link: '/students', icon: 'user-graduate', restrictedTo:['Cycle Coordinator']},
  {name: 'GitHub', link: 'https://github.com/TheCask/misCursosUNQ-front.git/', icon: ['fab', 'github'], restrictedTo:['', 'Teacher', 'Cycle Coordinator']}
];
// roles.some(role => item.restrictedTo.includes(role)) ?
export default class SideBar extends Component {
  render() {
    return (
      <userContext.Consumer>
        { value => { 
          let user = (value.appUser) ? value.appUser : null;
          let role = user ? value.actualRol : '';
          return (
            <Navbar dark style={{height: '100%', margin: '0px', alignItems: 'start', backgroundColor: 'rgb(88, 14, 14)', opacity: 0.7, paddingRight: '40px'}}>
              <Nav navbar vertical style={{display:'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '100%' }}>
                  {
                    sidebarItems.map(item => 
                      item.restrictedTo.includes(role) ?
                      <NavItem key={item.name}>
                          <NavLink href={item.link} style={{alignItems: 'center', display: 'block', width: 'inherit' }}>
                              <FontAwesomeIcon icon={item.icon} size="1x" color="light" style={{valign: 'center', width: '45px'}}/>
                              {item.name}
                          </NavLink>
                      </NavItem>
                      : ""
                    )
                  }
              </Nav>
            </Navbar> 
          )
          }
        }
      </userContext.Consumer>
    )
  }
}