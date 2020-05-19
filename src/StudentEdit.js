import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Container, Form, FormGroup, Input, Label, ButtonGroup, UncontrolledTooltip } from 'reactstrap';
import AppNavbar from './AppNavbar';

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
      const student = await (await fetch(`/api/student/${this.props.match.params.id}`)).json();
      this.setState({item: student});
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
    await fetch('/api/student', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item),
    });
    this.props.history.push('/students');
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
          <ButtonGroup inline="true">
            <Button size="sm" color="primary" type="submit" id="editStudent">
              <UncontrolledTooltip placement="auto" target="editStudent">
                {item.fileNumber ? 'Save Changes' : 'Save New Student'}
              </UncontrolledTooltip>
              <FontAwesomeIcon icon={['fas', 'save']} size="2x"/>
            </Button>{' '}
            <Button size="sm" color="secondary" tag={Link} to="/students" id="backToStudent">
              <UncontrolledTooltip placement="auto" target="backToStudent">
                Discard and Back to Student
              </UncontrolledTooltip>
              <FontAwesomeIcon icon={['fas', 'backward']} size="2x"/>
            </Button>
          </ButtonGroup>
        </FormGroup>
          <FormGroup>
            <Input type="number" name="fileNumber" id="number" value={item.fileNumber || ''}
                   onChange={this.handleChange} placeholder="File Number" disabled={!newStudent}/>
          </FormGroup>
          <FormGroup>
            <Input type="number" name="dni" id="dni" value={item.personalData.dni || ''}
                   onChange={this.handleChange} placeholder="DNI"/>
          </FormGroup>
          <FormGroup>
            <Input type="text" name="firstName" id="firstName" value={item.personalData.firstName || ''}
                   onChange={this.handleChange} placeholder="First Name"/>
          </FormGroup>
          <FormGroup>
            <Input type="text" name="lastName" id="lastName" value={item.personalData.lastName || ''}
                   onChange={this.handleChange} placeholder="Last Name"/>
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