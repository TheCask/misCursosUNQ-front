import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Container, Form, FormGroup, Input, ButtonGroup, Label, UncontrolledTooltip, Row, Col } from 'reactstrap';
import AppNavbar from './AppNavbar';
import SaveButton from './buttonBar/SaveButton'
import CancelButton from './buttonBar/CancelButton'
import * as UserAPI from './services/UserAPI';
import ComponentWithErrorHandling from './errorHandling/ComponentWithErrorHandling'
import Log from '../Log'

// auth config
const config = require('./authConfig');

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
    const {name, value} = event.target;
    let item = {...this.state.item};
    this.setInnerPropValue(item, name, value);
    item['coordinatedSubjects'] = []
    item['taughtCourses'] = []
    this.setState({item});
  }
  
  async handleSubmit(event) {
    // update this.state.body.registration.data.userData
    let body = this.state.body;
    body.registration.data = {userData: event.target.value};
    this.setState({ body: body });

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
        {this.renderErrorModal()}
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
              <Label for="imageUrl">Image Link</Label>
              <Input type="url" name="imageURL" id="imageUrl" value={body.imageURL || ''}
                    onChange={this.handleChange} placeholder="Image URL"/>
            </FormGroup>
            </Col>
            <Col xs="5">
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
            </Col>
          </Row>
          </Form>
        </Container>
      </AppNavbar>
  )}
}

export default withRouter(SetUser);