import React, { Component } from 'react';
import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom';
import logoUNQ from './images/logoUNQ.png';
import logoApp from './images/logoAppWhite.png';

export default class AppNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {isOpen: false};
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    return (
    <Navbar color="dark" dark> 
      <NavbarBrand href="http://ciclointroductoriocyt.web.unq.edu.ar" >
        <img className="app-logo" alt="applogo" src={logoApp}
           height="48" width="48" align="left" style={{margin: '0px 0px'}}/>
      </NavbarBrand>
      <NavLink href="https://www.unq.edu.ar">
        <img className="unq-logo" alt="unqlogo" src={logoUNQ} 
          height="48" width="128" align="center" style={{margin: '0px 0px'}}/>
      </NavLink>
      <NavbarToggler onClick={this.toggle}/>
      <Collapse isOpen={this.state.isOpen} navbar>
        <Nav navbar>
        <NavItem>
          <NavLink href="/">
            <FontAwesomeIcon icon='home' size="1x" color="light"/>{' HOME'}
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="/Courses">
            <FontAwesomeIcon icon='chalkboard' size="1x" color="light"/>{' Courses'}
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="/Users">
            <FontAwesomeIcon icon='chalkboard-teacher' size="1x" color="light"/>{' Users'}
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="/Subjects">
            <FontAwesomeIcon icon='university' size="1x" color="light"/>{' Subjects'}
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="/Students">
            <FontAwesomeIcon icon='user-graduate' size="1x" color="light"/>{' Students'}
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="https://github.com/TheCask/misCursosUNQ-front.git/">
            <FontAwesomeIcon icon={['fab', 'github']} size="1x" color="light"/>{' GitHub'}
          </NavLink>
        </NavItem>
        </Nav>
      </Collapse>
    </Navbar>
    )
  }
}