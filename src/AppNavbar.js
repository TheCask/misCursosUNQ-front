import React, { Component } from 'react';
import { Container, Row, Col, Navbar, NavbarBrand, NavLink } from 'reactstrap';
import logoUNQ from './images/logoUNQ.png';
import logoApp from './images/logoAppWhite.png';
import SideBar from './SideBar';
import Greeting from './login/Greeting'
import LogInOut from './login/LogInOut'
import ErrorBoundary from './errorHandling/ErrorBoundary';
import Log from './Log'

// auth config
const config = require('./authConfig');

export default class AppNavbar extends Component {
  
  constructor(props) {
    super(props);
    this.state = {isErrorModalOpen: true, 
      lastError: {title: "", description: "", error: null},
      body: {}};
    this.toggle = this.toggleErrorModal.bind(this);
    this.props = props;
  }

  async componentDidMount() {
    // fetch won't send cookies unless you set credentials
    await fetch(`http://localhost:${config.serverPort}/user`, {credentials: 'include'})
      .then(response => response.json())
      .then(response => this.setState({body: response}));
      Log.info("Response", this.state.body);
  }

  showError(title, description, error){
    this.setState({isErrorModalOpen: true, 
      lastError: {title: "", description: "", error: null}});
  }

  toggleErrorModal() {
    this.setState({isErrorModalOpen: !this.state.isErrorModalOpen});
  }

  render() {
    return (
      <div>
        <Navbar style={{backgroundColor:"rgba(20, 0, 0, 0.80)", boxShadow: 'rgba(80, 0, 0, 0.42) 0px 3px 8px'}}> 
          <Col align="left">
            <NavbarBrand href="http://ciclointroductoriocyt.web.unq.edu.ar" >
              <img className="app-logo" alt="applogo" src={logoApp}
                height="48" width="48" style={{margin: '0px 30px'}}/>
            </NavbarBrand>
          </Col>
          <Col align="center">
            <NavLink href="https://www.unq.edu.ar">
              <img className="unq-logo" alt="unqlogo" src={logoUNQ} 
                height="48" width="128" style={{margin: '0px 0px'}}/>
            </NavLink>
          </Col>
          <Col align="right">
            <Greeting body={this.state.body} align="right"/>
            <br></br>
            <LogInOut body={this.state.body} uri={`http://localhost:${config.serverPort}`}/>
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