import React from 'react';
import { Container, Row, Col, Navbar } from 'reactstrap';
import logoUNQ from './images/logoUNQ.png';
import logoApp from './images/logoAppWhite.png';
import SideBar from './SideBar';
import Greeting from './login/Greeting'
import Rol from './login/Rol'
import LogInOut from './login/LogInOut'
import ErrorBoundary from './errorHandling/ErrorBoundary';
import ComponentWithErrorHandling from './errorHandling/ComponentWithErrorHandling';

export default class AppNavbar extends ComponentWithErrorHandling {
  
  constructor(props) {
    super(props);
    this.state = {isErrorModalOpen: true, 
      lastError: {title: "", description: "", error: null}};
    this.toggle = this.toggleErrorModal.bind(this);
    this.props = props;
  }

  render() {
    return (
      <div>
        <Navbar style={{backgroundColor:"rgba(20, 0, 0, 0.20)", boxShadow: 'rgba(80, 0, 0, 0.42) 0px 3px 8px'}}> 
          <Col align="left">            
            <a href="http://ciclointroductoriocyt.web.unq.edu.ar">
            <img className="app-logo" alt="applogo" src={logoApp}
              height="48" width="48" style={{margin: '0px 15px 0px 0px'}}/>
            </a>
            <a href="https://www.unq.edu.ar">
              <img className="unq-logo" alt="unqlogo" src={logoUNQ} 
              height="48" width="128" style={{margin: '0px 0px'}}/>
            </a>
          </Col>
          <Col align="center">
            <Greeting/>
          </Col>
          <Col align="center">
            <Rol/>
          </Col>
          <Col align="right">
            <LogInOut/>
          </Col>
        </Navbar>
        <Container fluid style={{margin: '0px', height: '100vh'}}>
          <Row style={{height: 'inherit'}}>
            <Col md='auto' style={{ padding: '0px', height: 'inherit', boxShadow: "inset 7px 0px 11px 1px rgba(0,0,0,0.45)"}}>
              <SideBar />
            </Col>
            <Col className='content'>
              <ErrorBoundary>
                {this.props.children}
              </ErrorBoundary>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}