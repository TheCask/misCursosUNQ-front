import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table, CustomInput, Form } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import Log from './Log';

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
      attendantStudentsIds: [], 
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

    // Log.info('You toggled ' + target.checked + ' asistance of', fileNumber)
    // const {students} = this.state;
    // const studentsIds = students.map((st) => st["fileNumber"])

    fetch(`/api/course/${this.props.match.params.id}/lessons`)
        .then(response => response.json())
        .then(data => this.setState({lessons: data, isLoading: false}));
  }

  async handleSubmit(event) {
    event.preventDefault();
    let item = {...this.state.item};
    item["attendantStudents"] = this.state.attendantStudentsIds
    Log.info('Actual attend students ' + item)
    this.setState({item: item})
    await fetch('/api/lesson', {
      method: (item.lessonId) ? 'PUT' : 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item),
    });
    this.props.history.push('/courses');
  }

  toggleAttendance(event) {
    const target = event.target;
    const fileNumber = target.id;
    let studentsIds = this.state.attendantStudentsIds
    if (target.checked) {
      studentsIds = studentsIds.concat({fileNumber})
    }
    else {
      const newStudentsIds = studentsIds.filter(st => st.fileNumber !== fileNumber)
      studentsIds = newStudentsIds
    }
    this.setState({attendantStudentsIds: studentsIds})
  }

  render() {
    const {students, isLoading} = this.state;
    if (isLoading) {
      return <p>Loading...</p>;
    }
    const studentList = students.map((student) => {
      return <tr key={student.fileNumber}>
        <td style={{whiteSpace: 'nowrap'}}>{student.fileNumber || ''}</td>
        <td style={{whiteSpace: 'nowrap'}}>{student.personalData.firstName || ''}</td>
        <td style={{whiteSpace: 'nowrap'}}>{student.personalData.lastName || ''}</td>
        <td>
          <CustomInput type="switch" name="attendantStudents" id={student.fileNumber} 
            onChange={this.toggleAttendance} defaultChecked={true}>
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