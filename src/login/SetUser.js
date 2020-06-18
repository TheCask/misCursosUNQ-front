import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Container, Form, FormGroup, Input, ButtonGroup, Label, UncontrolledTooltip, Row, Col } from 'reactstrap';
import AppNavbar from '../AppNavbar';
import SaveButton from '../buttonBar/SaveButton'
import CancelButton from '../buttonBar/CancelButton'
// import * as UserAPI from './services/UserAPI';
import ComponentWithErrorHandling from '../errorHandling/ComponentWithErrorHandling'
import Log from '../Log'


// To connect our new Express route to our React app, we’ll add a <textarea> to the React client 
// for editing registration.data.userData. This component will need a method that allows it to setState within App. 
// This is where body (and therefore registration) is stored in our React client. 
// This means we’ll need add the method to App and bind it before passing it down as a prop to the <textarea> component.



// auth config
const config = require('../authConfig');

class SetUser extends ComponentWithErrorHandling {

  body = {
    token: {
        active: true,
        applicationId: "06905d24-456c-47e6-a8ca-80ae4c76c2c5",
        aud: "06905d24-456c-47e6-a8ca-80ae4c76c2c5",
        authenticationType: "PASSWORD",
        email: "eugeniocalcena@gmail.com",
        email_verified: true,
        exp: 1592263855,
        iat: 1592260255,
        iss: "acme.com",
        roles: [],
        sub: "a5ccf88e-e533-4302-9d6c-eddc211ba0cc"
    },
    registration: {
        applicationId: "06905d24-456c-47e6-a8ca-80ae4c76c2c5",
        id: "5c17a8a0-5f73-414d-8306-e39675c2ca6e",
        insertInstant: 1592179893830,
        lastLoginInstant: 1592260255646,
        preferredLanguages: [ "es_AR" ],
        timezone: "Etc/GMT-3",
        username: "TheCask",
        usernameStatus: "ACTIVE",
        verified: true
    }
}

  constructor(props) {
    super(props);
    this.state = {isErrorModalOpen: true, 
      lastError: {title: "", description: "", error: null},
      body: this.body};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    // fetch won't send cookies unless you set credentials
    await fetch(`http://localhost:${config.serverPort}/getUser`, {credentials: 'include'})
      .then(response => response.json())
      .then(response => this.setState({body: response}));
      Log.info("Response", this.state.body);
  }

  handleChange(event) {
    let body = this.state.body;
    body.registration.username = event.target.value;
    this.setState({ body: body });
    // const {name, value} = event.target;
    // let body = {...this.state.body};
    // this.setInnerPropValue(body, name, value);
    // this.setState({body});
  }

  // setInnerPropValue(baseObj, subPropString, value){
  //   const subProps = subPropString.split(".");
  //   const lastPropName = subProps.pop(); // elimina del array y retorna el ultimo 
  //   let propRef = baseObj
  //   subProps.forEach(subprop => {
  //     propRef = propRef[subprop];
  //   });
  //   propRef[lastPropName] = value;
  // }

  async handleSubmit(event) {
    event.preventDefault();
    // save the change in FusionAuth
    const {body} = this.state;
    fetch(`http://localhost:${config.serverPort}/setUser`,
          {
            credentials: 'include',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: body.registration.username })
          });
  }
    // UserAPI.postUserAsync(item, () => this.props.history.push('/users'), this.showError("save user"));

  render() {
    const {body} = this.state;
    const title = <h2 className="float-left">{body ? 'Edit Profile' : ''}</h2>;
    return (
      <AppNavbar>
        {/* {this.renderErrorModal()} */}
        <Container fluid>
          <Form onSubmit={this.handleSubmit}>
          <Row xs="2">
            <Col>{title}</Col>
            <Col>
              <ButtonGroup className="float-right">
                <SaveButton entityId = {body} entityTypeCapName = "User"/>
                {' '}
                <CancelButton to = {"/"} entityTypeCapName = "User" />
              </ButtonGroup>
          </Col>
          </Row>
          <Row form>
            <Col xs="2">
            <FormGroup>
              <Label for="username">User Name</Label>
              <Input type="text" maxLength="20" name="registration.username" id="username"
                    onChange={this.handleChange} placeholder="Username" value={body.registration.username || ''}/>
            </FormGroup>
            </Col>
            {/* <Col xs="5">
            <FormGroup>
              <Label for="firstName">First Name</Label>
              <Input type="text" maxLength="50" name="firstName" id="firstName" value={body.firstName}
                    onChange={this.handleChange} placeholder="First Name" required/>
            </FormGroup>
            </Col>
            <Col xs="5">
            <FormGroup>
              <Label for="lastName">Last Name</Label>
              <Input type="text" maxLength="50" name="lastName" id="lastName" value={body.lastName}
                    onChange={this.handleChange} placeholder="Last Name" required/>
            </FormGroup>
            </Col> */}
          </Row>
          </Form>
        </Container>
      </AppNavbar>
  )}
}

export default withRouter(SetUser);