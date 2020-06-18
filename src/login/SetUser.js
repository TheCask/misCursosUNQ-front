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

  constructor(props) {
    super(props);
    this.state = {isErrorModalOpen: true, 
      lastError: {title: "", description: "", error: null},
      body: {}};
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

    // update this.state.body.registration.data.userData
    //const {name, value} = event.target;
    let body = this.state.body;
    body.registration.username = event.target.value;
    this.setState({ body: body });

    fetch(`http://localhost:${config.serverPort}/setUser`,
          {
            credentials: 'include',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: event.target.value })
          });

  }
    // let item = {...this.state.item};
    // this.setInnerPropValue(item, name, value);
    // item['coordinatedSubjects'] = []
    // item['taughtCourses'] = []
    // this.setState({item});
  
  async handleSubmit(event) {
    // save the change in FusionAuth
    fetch(`http://localhost:${config.serverPort}/setUser`,
          {
            credentials: 'include',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userData: event.target.value })
          });
  }

    // event.preventDefault();
    // const {item} = this.state;
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
                    onChange={this.handleChange} placeholder="Username"/>
            </FormGroup>
            {/* value={body.imageURL || ''} */}
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