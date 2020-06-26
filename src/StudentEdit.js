import React from 'react';
import { withRouter } from 'react-router-dom';
import { Container, Form, FormGroup, Input, ButtonGroup, Row, Col, Label } from 'reactstrap';
import AppNavbar from './AppNavbar';
import SaveButton from './buttonBar/SaveButton'
import CancelButton from './buttonBar/CancelButton'
import * as StudentAPI from './services/StudentAPI';
import ComponentWithErrorHandling from './errorHandling/ComponentWithErrorHandling'

class StudentEdit extends ComponentWithErrorHandling {

  emptyItem = {
    fileNumber: 0,
    personalData: {
      // personalDataId: 0,
      dni: 0,
      firstName: '',
      lastName: '',
      email: '',
      cellPhone: ''
    },
    takenCourses: [],
    attendedLessons: []
  };

  constructor(props) {
    super(props);
    this.state = {...this.state, ...{
      item: this.emptyItem,
    }};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    if (this.props.match.params.id !== 'new') {
      StudentAPI.getStudentByIdAsync(this.props.match.params.id, 
        student => this.setState({item: student}), 
        this.showError("get student details"))
    }
  }

  handleChange(event) {
    const {name, value} = event.target;
    let item = {...this.state.item};
    if (name === 'fileNumber') { item[name] = value; }
    else { item['personalData'][name] = value }
    item['attendedLessons'] = []
    this.setState({item});
  }

  async handleSubmit(event) {
    event.preventDefault();
    const {item} = this.state;
    StudentAPI.postStudentAsync(item, () => this.props.history.push('/students'), this.showError("save student")); // TODO: replace null by error showing code
  }

  render() {
    const {item} = this.state;
    let newStudent = this.props.match.params.id === 'new'
    const title = <h2 className="float-left">{!newStudent ? 'Edit Student' : 'Add Student'}</h2>;
    return (
      <AppNavbar>
        {this.renderErrorModal()}
        <Container fluid>
          <Form onSubmit={this.handleSubmit}>
          <Row xs="2">
            <Col>{title}</Col>
            <Col>
            <ButtonGroup className="float-right">
              <SaveButton entityId = {item.fileNumber} entityTypeCapName = "Student" />
              {' '}
              <CancelButton to = {"/students"} entityTypeCapName = "Student" />
            </ButtonGroup>
            </Col>
          </Row>
          <Row form>
            <Col xs='2'>
              <FormGroup>
              <Label for="number">File Number</Label>
                <Input type="number" min="0" max="2147483647" name="fileNumber" id="number" value={item.fileNumber || ''} required
                      onChange={this.handleChange} placeholder="File Number" disabled={!newStudent}/>
              </FormGroup>
            </Col>
            <Col xs='2'>
              <FormGroup>
                <Label for="dni">DNI</Label>
                <Input type="number" min="0" max="2147483647" name="dni" id="dni" value={item.personalData.dni || ''}
                      onChange={this.handleChange} placeholder="DNI" required/>
              </FormGroup>
            </Col>
          </Row>
          <Row form>
            <Col xs='4'>
              <FormGroup>
                <Label for="firstName">First Name</Label>
                <Input type="text" name="firstName" id="firstName" value={item.personalData.firstName || ''}
                      onChange={this.handleChange} placeholder="First Name" required/>
              </FormGroup>
            </Col>
            <Col xs='4'>
              <FormGroup>
                <Label for="lastName">Last Name</Label>
                <Input type="text" name="lastName" id="lastName" value={item.personalData.lastName || ''}
                      onChange={this.handleChange} placeholder="Last Name" required/>
              </FormGroup>
            </Col>
          </Row>
          <Row form>
            <Col xs='4'>
              <FormGroup>
                <Label for="email">e Mail</Label>
                <Input type="email" name="email" id="email" value={item.personalData.email || ''}
                      onChange={this.handleChange} placeholder="e Mail"/>
              </FormGroup>
            </Col>
            <Col xs='4'>
              <FormGroup>
                <Label for="cellPhone">Cell Phone</Label>
                <Input type="tel" name="cellPhone" id="cellPhone" value={item.personalData.cellPhone || ''} 
                        title="Separar característica y número con un guión. Ej. 0229-4787658"
                        onChange={this.handleChange} placeholder="Cell Phone" pattern="\d{2,4}-\d{6,8}"/>
              </FormGroup>
            </Col>
          </Row>
          </Form>
        </Container>
      </AppNavbar>
    )}
}

export default withRouter(StudentEdit);