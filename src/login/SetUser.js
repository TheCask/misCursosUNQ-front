import React from 'react';
import { withRouter } from 'react-router-dom';
import { Container, Form, FormGroup, Input, ButtonGroup, Label, CustomInput, Row, Col } from 'reactstrap';
import AppNavbar from '../AppNavbar';
import SaveButton from '../buttonBar/SaveButton'
import CancelButton from '../buttonBar/CancelButton'
import * as AuthAPI from '../services/AuthAPI'
import ComponentWithErrorHandling from '../errorHandling/ComponentWithErrorHandling'
import Log from '../Log'

class SetUser extends ComponentWithErrorHandling {

  user = {
    username: "TheCask",
    email: "eugeniocalcena@gmail.com",
    firstName: "Eugenio Nicolas",
    fullName: "", // Autoconstruct lastName, firstName
    lastName: "Cálcena",
    middleName: "", // Not Used
    mobilePhone: "11-35684811",
    passwordChangeRequired: false,
    birthDate: "1981-05-07",
    preferredLanguages: [], // this property always concats to the list (bug)
    timezone: "Etc/GMT-3", // not change
    twoFactorDelivery: "None", // not change
    twoFactorEnabled: false, // not change
    usernameStatus: "ACTIVE", // not change
    verified: true // not change
}

  constructor(props) {
    super(props);
    this.state = {isErrorModalOpen: true, 
      lastError: {title: "", description: "", error: null},
      user: this.user};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    AuthAPI.getGlobalUserByIdAsync(json => this.setState({user: json.user}), this.showError("get global profile"));
  }

  handleChange(event) {
    const {name, value} = event.target;
    let user = this.state.user;
    user[name] = value;
    user['fullName'] = user.lastName + ', ' + user.firstName; // constructs full user name
    // update this property with empty list avoids always growing list (concat bug)
    user['preferredLanguages'] = []
    this.setState({ user: user });
  }

  handleSubmit(event) {
    event.preventDefault();
    const {user} = this.state;
    Log.info("User", user)
    // save the change in FusionAuth
    AuthAPI.postGlobalUserAsync(user, () => this.props.history.push('/profile'), this.showError("save global profile"));
  }

  render() {
    const {user} = this.state;
    const title = <h2 className="float-left">{user ? 'Edit Profile' : ''}</h2>;
    return (
      <AppNavbar>
        {/* {this.renderErrorModal()} */}
        <Container fluid>
          <Form onSubmit={this.handleSubmit}>
          <Row xs="2">
            <Col>{title}</Col>
            <Col>
              <ButtonGroup className="float-right">
                <SaveButton entityId = {user} entityTypeCapName = "User"/>
                {' '}
                <CancelButton to = {"/"} entityTypeCapName = "User" />
              </ButtonGroup>
            </Col>
          </Row>
          <Row>
            <Col xs="3">
            <FormGroup>
              <Label for="username">User Name</Label>
              <Input type="text" maxLength="20" name="username" id="username" value={user.username || ''}
                    onChange={this.handleChange} placeholder="Username" required />
            </FormGroup>
            </Col>
            <Col xs="4">
            <FormGroup>
              <Label for="email">Mail</Label>
              <Input type="email" maxLength="50" name="email" id="email" value={user.email || ''}
                    onChange={this.handleChange} placeholder="e Mail" pattern="^.*@.*\..*$" required/>
            </FormGroup>
            </Col> 
            <Col xs="2">
            <FormGroup>
              <Label for="mobilePhone">Cell Phone</Label>
              <Input type="text" name="mobilePhone" id="mobilePhone" value={user.mobilePhone || ''}
                    title="Separar característica y número con un guión (no incluir 15 al inicio). Ej. 0229-4787658"
                    onChange={this.handleChange} placeholder="Cell Phone" pattern="\d{2,4}-\d{6,8}" required/>
            </FormGroup>
            </Col>
            <Col xs="3">
            <FormGroup>
              <Label for="birthDate">Fecha de Nacimiento</Label>
              <Input type="text" maxLength="10" name="birthDate" id="birthDate" value={user.birthDate || ''}
                    title="Formato AAAA-MM-DD. Ej. 2003-07-25" pattern="\w{4}-\w{2}-\w{2}" required
                    onChange={this.handleChange} placeholder="Fecha de Nacimiento"/>
            </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col xs="4">
            <FormGroup>
              <Label for="firstName">First Name</Label>
              <Input type="text" maxLength="50" name="firstName" id="firstName" value={user.firstName || ''}
                    onChange={this.handleChange} placeholder="First Name" required/>
            </FormGroup>
            </Col>
            <Col xs="4">
            <FormGroup>
              <Label for="lastName">Last Name</Label>
              <Input type="text" maxLength="50" name="lastName" id="lastName" value={user.lastName || ''}
                    onChange={this.handleChange} placeholder="Last Name" required/>
            </FormGroup>
            </Col>
            <Col xs="4">
            <FormGroup>
              <Label for="fullName">Full Name</Label>
              <Input type="text" name="fullName" id="fullName" value={user.fullName || ''} disabled/>
            </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col xs="6">
            <FormGroup>
              <Label for="passwordChangeRequired">Change Password</Label>
              <CustomInput type="switch" name="passwordChangeRequired" id="passwordChangeRequired" value={user.passwordChangeRequired || ''}
                    onChange={this.togglePasswordChangeRequired} label="Change Password in Next Login"/>
            </FormGroup>
            </Col>
          </Row>
          </Form>
        </Container>
      </AppNavbar>
  )}
}

export default withRouter(SetUser);