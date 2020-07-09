import React from 'react';
import { withRouter } from 'react-router-dom';
import { Container, Form, FormGroup, Input, ButtonGroup, Row, Col, Label } from 'reactstrap';
import AppNavbar from '../AppNavbar';
import SaveButton from '../buttons/SaveButton'
import CancelButton from '../buttons/CancelButton'
import { userContext } from '../login/UserContext';
import AccessError from '../errorHandling/AccessError';
import * as StudentAPI from '../services/StudentAPI';
import ComponentWithErrorHandling from '../errorHandling/ComponentWithErrorHandling'
import * as Constants from '../auxiliar/Constants'

class StudentEdit extends ComponentWithErrorHandling {

  constructor(props) {
    super(props);
    this.state = {...this.state, ...{
      item: Constants.emptyStudent,
    }};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onlyDetail = props.onlyDetail || false;
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
    StudentAPI.postStudentAsync(item, 
      () => this.props.history.push('/students'), 
      this.showError("save student"));
  }

  chooseTitle(onlyDetail, newStudent) {
    let title = ''
    if (onlyDetail) { title = 'Student Details' }
    else if (newStudent) { title = 'Add Student'}
    else { title = 'Edit Student'}
    return <h2 className="float-left">{title}</h2>;
  }

  render() {
    const {item} = this.state;
    let newStudent = this.props.match.params.id === 'new';
    let onlyDetail = this.onlyDetail;
    let title = this.chooseTitle(onlyDetail, newStudent);
    this.actualRol = this.context.actualRol;
    return (this.actualRol === 'Guest' || (this.actualRol === 'Teacher' && !onlyDetail) ?
      <AccessError errorCode="Only Cycle Coordinator are allowed" 
          errorDetail="Make sure you are signed in with valid role before try to access this page"/>
      :
      <AppNavbar>
        {this.renderErrorModal()}
        <Container fluid>
          <Form onSubmit={this.handleSubmit}>
          <Row xs="2">
            <Col>{title}</Col>
            <Col>
            <ButtonGroup className="float-right">
              <SaveButton entityId = {item.fileNumber} entityTypeCapName = "Student" disabled={onlyDetail}/>
              {' '}
              <CancelButton onClick={() => this.props.history.goBack()} />
            </ButtonGroup>
            </Col>
          </Row>
          <Row form>
            <Col xs='2'>
              <FormGroup>
              <Label for="number">File Number</Label>
                <Input type="number" min="0" max="2147483647" name="fileNumber" id="number" value={item.fileNumber || ''} required
                      onChange={this.handleChange} placeholder="File Number" disabled={!newStudent || onlyDetail}/>
              </FormGroup>
            </Col>
            <Col xs='2'>
              <FormGroup>
                <Label for="dni">DNI</Label>
                <Input type="number" min="0" max="2147483647" name="dni" id="dni" value={item.personalData.dni || ''}
                      onChange={this.handleChange} placeholder="DNI" required disabled={onlyDetail}/>
              </FormGroup>
            </Col>
          </Row>
          <Row form>
            <Col xs='4'>
              <FormGroup>
                <Label for="firstName">First Name</Label>
                <Input type="text" name="firstName" id="firstName" value={item.personalData.firstName || ''}
                      onChange={this.handleChange} placeholder="First Name" required disabled={onlyDetail}/>
              </FormGroup>
            </Col>
            <Col xs='4'>
              <FormGroup>
                <Label for="lastName">Last Name</Label>
                <Input type="text" name="lastName" id="lastName" value={item.personalData.lastName || ''}
                      onChange={this.handleChange} placeholder="Last Name" required disabled={onlyDetail}/>
              </FormGroup>
            </Col>
          </Row>
          <Row form>
            <Col xs='4'>
              <FormGroup>
                <Label for="email">e Mail</Label>
                <Input type="email" name="email" id="email" value={item.personalData.email || ''}
                      onChange={this.handleChange} placeholder="e Mail" disabled={onlyDetail}/>
              </FormGroup>
            </Col>
            <Col xs='4'>
              <FormGroup>
                <Label for="cellPhone">Cell Phone</Label>
                <Input type="tel" name="cellPhone" id="cellPhone" value={item.personalData.cellPhone || ''} 
                        title="Separar característica y número con un guión. Ej. 0229-4787658" disabled={onlyDetail}
                        onChange={this.handleChange} placeholder="Cell Phone" pattern="\d{2,4}-\d{6,8}"/>
              </FormGroup>
            </Col>
          </Row>
          </Form>
        </Container>
      </AppNavbar>
    )}
}
StudentEdit.contextType = userContext;
export default withRouter(StudentEdit);