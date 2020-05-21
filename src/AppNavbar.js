import React, { Component } from 'react';
import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink,
  Dropdown, DropdownItem, DropdownToggle, DropdownMenu } from 'reactstrap';
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
          <Dropdown nav isOpen={this.state.isOpen} toggle={this.toggle}>
            <DropdownToggle nav caret> Menu </DropdownToggle>
            <DropdownMenu>
              <DropdownItem header>Where to go now?</DropdownItem>
              <DropdownItem divider/>
              <DropdownItem ><a href="/users"> Users </a></DropdownItem>
              <DropdownItem divider/>
              <DropdownItem ><a href="/subjects"> Subjects </a></DropdownItem>
              <DropdownItem divider/>
              <DropdownItem ><a href="/courses"> Courses </a></DropdownItem>
              <DropdownItem divider/>
              <DropdownItem ><a href="/students"> Students </a></DropdownItem>
            </DropdownMenu>
          </Dropdown>
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