import React, { Component } from 'react';
import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import logo from './logo.png';

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
      <NavbarBrand tag={Link} to="/">misCursosUNQ</NavbarBrand>
      <NavbarToggler onClick={this.toggle}/>
        <a href="https://www.unq.edu.ar">
          <img src={logo} className="unq-logo" alt="logo" height="48" width="128" align="middle" style={{margin: '0px 400px'}}/>
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