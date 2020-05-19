import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Container, Form, FormGroup, Input, Label, ButtonGroup, UncontrolledTooltip } from 'reactstrap';
import AppNavbar from './AppNavbar';
import SaveButton from './buttonBar/SaveButton'
import CancelButton from './buttonBar/CancelButton'
import * as BackAPI from './BackAPI';

class StudentEdit extends Component {

  emptyItem = {
    fileNumber: '',
    personalData: {
      dni: '',
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
    this.state = {
      item: this.emptyItem,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    if (this.props.match.params.id !== 'new') {
      const student = BackAPI.getStudentByIdAsync(this.props.match.params.id, student => this.setState({item: student}), null) // TODO: replace null by error showing code
    }
  }

  handleChange(event) {
    const {name, value} = event.target;
    let item = {...this.state.item};
    if (name === "fileNumber") { item[name] = value; }
    else { item['personalData'][name] = value }
    item['attendedLessons'] = []
    this.setState({item});
  }

  async handleSubmit(event) {
    event.preventDefault();
    const {item} = this.state;
    BackAPI.postStudentAsync(item, () => this.props.history.push('/students'), null); // TODO: replace null by error showing code
  }

  render() {
    const {item} = this.state;
    let newStudent = this.props.match.params.id === 'new'
    const title = <h2 className="float-left">{!newStudent ? 'Edit Student' : 'Add Student'}</h2>;
    return <div>
      <AppNavbar/>
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
            <Input type="number" name="fileNumber" id="number" value={item.fileNumber || ''} required
                   onChange={this.handleChange} placeholder="File Number" disabled={!newStudent}/>
        </FormGroup>
        <FormGroup>
            <Input type="number" name="dni" id="dni" value={item.personalData.dni || ''}
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
            <Input type="text" name="email" id="email" value={item.personalData.email || ''}
                   onChange={this.handleChange} placeholder="e Mail"/>
        </FormGroup>
        <FormGroup>
            <Input type="number" name="cellPhone" id="cellPhone" value={item.personalData.cellPhone || ''}
                   onChange={this.handleChange} placeholder="Cell Phone"/>
        </FormGroup>

        </Form>
      </Container>
    </div>
  }
}

export default withRouter(StudentEdit);