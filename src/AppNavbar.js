import React, { Component } from 'react';
import { Container, Row, Col, Navbar, NavbarBrand, NavLink } from 'reactstrap';
import logoUNQ from './images/logoUNQ.png';
import logoApp from './images/logoAppWhite.png';
import SideBar from './SideBar';
import ErrorModal from './ErrorModal';
import ErrorHandler from './ErrorHandler';

export default class AppNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {isErrorModalOpen: true, lastError: {title: "", description: "", error: null}};
    this.toggle = this.toggleErrorModal.bind(this);
    this.props = props;
  }

  showError(title, description, error){
    this.setState({isErrorModalOpen: true, 
                   lastError: {title: "", description: "", error: null}});
  }

  toggleErrorModal() {
    this.setState({
      isErrorModalOpen: !this.state.isErrorModalOpen
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
            <Col md='auto' style={{ padding: '0px', height: 'inherit', boxShadow: "inset 7px 0px 11px 1px rgba(0,0,0,0.45)"}}>
              <SideBar />
            </Col>
            <Col className='content'>
              <ErrorHandler>
                {this.props.children}
              </ErrorHandler>
            </Col>
          </Row>
        </Container>
        

      </div>

    )
  }
}