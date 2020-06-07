import React from 'react';
import { withRouter } from 'react-router-dom';
import { Container, Form, FormGroup, Input, ButtonGroup } from 'reactstrap';
import AppNavbar from './AppNavbar';
import SaveButton from './buttonBar/SaveButton'
import CancelButton from './buttonBar/CancelButton'
import * as StudentAPI from './services/StudentAPI';
import ComponentWithErrorHandling from './ComponentWithErrorHandling'

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
      StudentAPI.getStudentByIdAsync(this.props.match.params.id, student => this.setState({item: student}), this.buildHandler("get student details")) // TODO: replace null by error showing code
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
    StudentAPI.postStudentAsync(item, () => this.props.history.push('/students'), this.buildHandler("save student")); // TODO: replace null by error showing code
  }

  render() {
    const {item} = this.state;
    let newStudent = this.props.match.params.id === 'new'
    const title = <h2 className="float-left">{!newStudent ? 'Edit Student' : 'Add Student'}</h2>;
    return <AppNavbar>
        {this.renderErrorModal()}
        <Container fluid>
          <Form onSubmit={this.handleSubmit}>
          {title}
          <FormGroup className="float-right">
            <ButtonGroup>
              <SaveButton
                entityId = {item.fileNumber}
                entityTypeCapName = "Student"
              />
              {' '}
              <CancelButton
                to = {"/students"}
                entityTypeCapName = "Student"
              />
            </ButtonGroup>
          </FormGroup>
            <FormGroup>
              <Input type="number" min="0" max="2147483647" name="fileNumber" id="number" value={item.fileNumber || ''} required
                    onChange={this.handleChange} placeholder="File Number" disabled={!newStudent}/>
          </FormGroup>
          <FormGroup>
              <Input type="number" min="0" max="2147483647" name="dni" id="dni" value={item.personalData.dni || ''}
                    onChange={this.handleChange} placeholder="DNI" required/>
            </FormGroup>
            <FormGroup>
              <Input type="text" name="firstName" id="firstName" value={item.personalData.firstName || ''}
                    onChange={this.handleChange} placeholder="First Name" required/>
            </FormGroup>
            <FormGroup>
              <Input type="text" name="lastName" id="lastName" value={item.personalData.lastName || ''}
                    onChange={this.handleChange} placeholder="Last Name" required/>
            </FormGroup>
            <FormGroup>
              <Input type="email" name="email" id="email" value={item.personalData.email || ''}
                    onChange={this.handleChange} placeholder="e Mail"/>
          </FormGroup>
          <FormGroup>
              <Input type="tel" name="cellPhone" id="cellPhone" value={item.personalData.cellPhone || ''} 
                      title="Separar característica y número con un guión. Ej. 0229-4787658"
                      onChange={this.handleChange} placeholder="Cell Phone" pattern="[0-9]*-[0-9]*"/>
          </FormGroup>
          </Form>
        </Container>
      </AppNavbar>
  }
}

export default withRouter(StudentEdit);