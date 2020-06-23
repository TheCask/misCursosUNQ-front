import React from 'react';
import { withRouter } from 'react-router-dom';
import { Container, Form, FormGroup, Input, Card, CardFooter, CardHeader, CardImg,
  ButtonGroup, Label, UncontrolledTooltip, Row, Col } from 'reactstrap';
import AppNavbar from '../AppNavbar';
import AccessError from '../AccessError';
import AppSpinner from '../AppSpinner';
import SaveButton from '../buttonBar/SaveButton'
import CancelButton from '../buttonBar/CancelButton'
import * as AuthAPI from '../services/AuthAPI'
import ComponentWithErrorHandling from '../errorHandling/ComponentWithErrorHandling'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Button from 'reactstrap/lib/Button';

class SetUser extends ComponentWithErrorHandling {

  user = {
    username: "",
    email: "",
    firstName: "",
    fullName: "", // Autoconstruct lastName, firstName
    lastName: "",
    middleName: "", // Not Used
    mobilePhone: "",
    passwordChangeRequired: false,
    birthDate: "",
    preferredLanguages: [], // this property always concats to the list (PATCH method bug on FusionAuth)
    timezone: "Etc/GMT-3", // not change
    twoFactorDelivery: "None", // not used
    twoFactorEnabled: false, // not used
    usernameStatus: "ACTIVE", // not used
    verified: true // only show
}

  constructor(props) {
    super(props);
    this.state = {isErrorModalOpen: false, 
      lastError: {title: "", description: "", error: null},
      globalUser: this.user, isLoading: true};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleToggleCheckbox = this.handleToggleCheckbox.bind(this);
  }

  async componentDidMount() {
    AuthAPI.getGlobalUserByIdAsync(json => this.setState({globalUser: json.user, isLoading: false}), 
      this.showError("get global profile"));
  }

  handleToggleCheckbox(event) {
    let newValue = !this.state.globalUser.passwordChangeRequired;
    let user = this.state.globalUser;
    user['passwordChangeRequired'] = newValue;
    this.setState({globalUser: user})
  }

  handleChange(event) {
    const {name, value} = event.target;
    let user = this.state.globalUser;
    user[name] = value;
    user['fullName'] = user.lastName + ', ' + user.firstName; // constructs full user name
    // update this property with empty list avoids always growing list (concat PATH bug on FusionAuth)
    user['preferredLanguages'] = []
    this.setState({ globalUser: user });
  }

  handleSubmit(event) {
    /* prevent form to submit to:
     - check some validation before submitting
     - change values of input fields 
     - submit using ajax calls */
    event.preventDefault();
    const {globalUser} = this.state;
    // save the change in FusionAuth
    AuthAPI.postGlobalUserAsync(globalUser, () => this.props.history.push('/profile'), 
      this.showError("save global profile"));
  }

  render() {
    const {globalUser, isLoading} = this.state;
    const title = <h2 className="float-left">{globalUser ? 'Edit Profile' : ''}</h2>;
    if (isLoading) { return (<AppSpinner/>) }
    return (
      (!globalUser) ? <AccessError errorCode="User Not Logged" 
        errorDetail="Make sure you are signed in before try to access this profile edit page"/>
        :
      <AppNavbar>
        <Container fluid>
          <Form onSubmit={this.handleSubmit}>
          <Row xs="2">
            <Col>{title}</Col>
            <Col>
              <ButtonGroup className="float-right">
                <SaveButton entityId = {globalUser} entityTypeCapName = "User"/>
                {' '}
                <CancelButton to = {"/courses"} entityTypeCapName = "Course" />
              </ButtonGroup>
            </Col>
          </Row>
          <Row>
            <Col xs="3">
              <Card>
                <CardHeader></CardHeader>
                <CardImg top width="100%" src={globalUser.imageUrl} alt="Card avatar" />
                <CardFooter></CardFooter>
              </Card>
            </Col>
            <Col xs="3">
              <FormGroup>
                <Label for="firstName">First Name</Label>
                <Input type="text" maxLength="50" name="firstName" id="firstName" value={globalUser.firstName || ''}
                      onChange={this.handleChange} placeholder="First Name" required/>
              </FormGroup>
              <FormGroup>
                <Label for="lastName">Last Name</Label>
                <Input type="text" maxLength="50" name="lastName" id="lastName" value={globalUser.lastName || ''}
                      onChange={this.handleChange} placeholder="Last Name" required/>
              </FormGroup>
              <FormGroup>
                <Label for="username">User Name</Label>
                <Input type="text" maxLength="20" name="username" id="username" value={globalUser.username || ''}
                      onChange={this.handleChange} placeholder="Username" required />
              </FormGroup>
            </Col>
            <Col xs="4">
              <FormGroup>
                <Label for="email">Mail</Label>
                <Input type="email" maxLength="50" name="email" id="email" value={globalUser.email || ''}
                      onChange={this.handleChange} placeholder="e Mail" pattern="^.*@.*\..*$" required/>
              </FormGroup>
              <FormGroup>
                <Label for="fullName">Full Name</Label>
                <Input type="text" name="fullName" id="fullName" value={globalUser.fullName || ''} disabled/>
              </FormGroup>
              <FormGroup>
                <Label for="role">Role</Label>
                <Input type="text" name="role" id="role" value={globalUser.registrations[0].roles.toString() || ''} disabled/>
              </FormGroup>
            </Col>
            <Col xs="2">
              <FormGroup>
                <Label for="mobilePhone">Cell Phone</Label>
                <Input type="text" name="mobilePhone" id="mobilePhone" value={globalUser.mobilePhone || ''}
                      title="Separar característica y número con un guión (no incluir 15 al inicio). Ej. 0229-4787658"
                      onChange={this.handleChange} placeholder="Cell Phone" pattern="\d{2,4}-\d{6,8}" required/>
              </FormGroup>
              <FormGroup>
                <Label for="birthDate">Bith Date</Label>
                <Input type="text" maxLength="10" name="birthDate" id="birthDate" value={globalUser.birthDate || ''}
                      title="Formato AAAA-MM-DD. Ej. 2003-07-25" pattern="\w{4}-\w{2}-\w{2}" required
                      onChange={this.handleChange} placeholder="Fecha de Nacimiento"/>
              </FormGroup>
              <Label for="emailCheck">Verified</Label>
              <Button block disabled color="white" size="sm">
                  {globalUser.verified ? 
                    <FontAwesomeIcon id='emailCheck' icon='user-check' color="green" size="2x"/>
                    : <FontAwesomeIcon id='emailCheck' icon='user-times' color="red" size="2x"/>
                  }
                  <UncontrolledTooltip placement="auto" target="emailCheck">
                    {globalUser.verified ? 'Verified User' : 'Unverified User'}
                  </UncontrolledTooltip>
              </Button>
            </Col>
          </Row>
          <br></br>
          <Row>
            <Col xs="3">
              {/* <FormGroup>
                <Label for="imageURL">Image URL</Label>
                <Input type="text" name="imageURL" id="imageURL" value={globalUser.imageUrl || ""}
                  onChange={this.handleChange} placeholder="Image URL" />
              </FormGroup> */}
              <FormGroup check inline>
                <Label check for="passwordChangeRequired">
                <Input type="checkbox" name="passwordChangeRequired" id="passwordChangeRequired" checked={globalUser.passwordChangeRequired || ''}
                      onChange={this.handleToggleCheckbox} label="Change Password in Next Login">
                </Input> Change Password
                </Label>
                <UncontrolledTooltip placement="auto" target="passwordChangeRequired">
                  Check this if you want to change your password in next login.
                </UncontrolledTooltip>
              </FormGroup>
            </Col>
          </Row>
          </Form>
        </Container>
      </AppNavbar>
  )}
}

export default withRouter(SetUser);