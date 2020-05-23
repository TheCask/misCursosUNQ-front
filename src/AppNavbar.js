import React, { Component } from 'react';
import { Container, Row, Col, Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom';
import logoUNQ from './images/logoUNQ.png';
import logoApp from './images/logoAppWhite.png';
import SideBar from './SideBar';

export default class AppNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {isOpen: false};
    this.toggle = this.toggle.bind(this);
    this.props = props;
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    return (
      <div>
        <Navbar style={{backgroundColor:"rgba(20, 0, 0, 0.80)", boxShadow: 'rgba(80, 0, 0, 0.42) 0px 3px 8px'}}> 
          <NavbarBrand href="http://ciclointroductoriocyt.web.unq.edu.ar" >
            <img className="app-logo" alt="applogo" src={logoApp}
              height="48" width="48" align="left" style={{margin: '0px 15px'}}/>
          </NavbarBrand>
          <NavLink href="https://www.unq.edu.ar">
            <img className="unq-logo" alt="unqlogo" src={logoUNQ} 
              height="48" width="128" align="center" style={{margin: '0px 0px'}}/>
          </NavLink>
        </Navbar>
        <Container fluid style={{margin: '0px', height: '100vh'}}>
          <Row style={{height: 'inherit'}}>
            <Col md='auto' style={{ padding: '0px', height: 'inherit'}}>
              <SideBar />
            </Col>
            <Col className='bla'>
              {this.props.children}
            </Col>
          </Row>
        </Container>
      </div>

    )
  }
}