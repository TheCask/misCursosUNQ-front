import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table, CustomInput, Form } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';

class Attendance extends Component {

  emptyItem = {
    course: {
      courseId: this.props.match.params.id
    },
    attendantStudents: []
  };

  constructor(props) {
    super(props);
    this.state = { 
      students: [], 
      lessons: [], 
      item: this.emptyItem,
      isLoading: true};
    this.toggleAttendance = this.toggleAttendance.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    this.setState({isLoading: true});
    fetch(`/api/course/${this.props.match.params.id}/students`)
        .then(response => response.json())
        .then(data => this.setState({students: data}));

    fetch(`/api/course/${this.props.match.params.id}/lessons`)
        .then(response => response.json())
        .then(data => this.setState({lessons: data, isLoading: false}));
  }

  async handleSubmit(event) {    
    event.preventDefault();
    this.state.item.attendantStudents = this.state.students
    await fetch('/api/lesson', {
      method: (this.state.item.id) ? 'PUT' : 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state.item),
    });
    // this.props.history.push('/lessons');
  }

  toggleAttendance(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    let item = {...this.state.item};
    this.setState({item});
  }

  render() {
    const {students, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const studentList = students.map((student, index) => {
      return <tr key={student.fileNumber}>
        <td style={{whiteSpace: 'nowrap'}}>{student.fileNumber || ''}</td>
        <td style={{whiteSpace: 'nowrap'}}>{student.personalData.firstName || ''}</td>
        <td style={{whiteSpace: 'nowrap'}}>{student.personalData.lastName || ''}</td>
        <td>
          <CustomInput type="switch" name="attendantStudent" id={index} onChange={this.toggleAttendance} 
            defaultChecked={true}>
          </CustomInput>
        </td>
      </tr>
    });

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
          <Form onSubmit={this.handleSubmit}>
            <ButtonGroup>
                <Button color="primary" type="submit">Save Attendance</Button>{' '}
                <Button color="secondary" tag={Link} to="/courses">Back To Course</Button>
            </ButtonGroup>
          </Form>
          </div>
          <h3>Students</h3>
          <Table className="mt-4">
            <thead>
            <tr>
              <th width="10%">File Number</th>
              <th width="15%">First Name</th>
              <th width="15%">Last Name</th>
              <th width="15%">Lesson Attended</th>
            </tr>
            </thead>
            <tbody>
            {studentList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default Attendance;