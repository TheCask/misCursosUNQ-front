import React, { Component } from 'react';
import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import logoUNQ from './logoUNQ.png';
import logoApp from './logoAppWhite.png';

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
    return <Navbar color="dark" dark expand="md">
      <NavbarBrand tag={Link} to="/">
        <img src={logoApp} className="app-logo" alt="applogo" height="48" width="48" align="left" style={{margin: '0px 0px'}}/>
      </NavbarBrand>
      <NavbarToggler onClick={this.toggle}/>
        <a href="https://www.unq.edu.ar">
          <img src={logoUNQ} className="unq-logo" alt="unqlogo" height="48" width="128" align="middle" style={{margin: '0px 500px'}}/>
        </a>
      <Collapse isOpen={this.state.isOpen} navbar>
        <Nav className="ml-auto" navbar>
          <NavItem>
            <NavLink 
                href="https://github.com/TheCask/misCursosUNQ-front.git">GitHub
            </NavLink>
          </NavItem>
        </Nav>
      </Collapse>
    </Navbar>;
  }
}