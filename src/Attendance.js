import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table, Form, UncontrolledTooltip } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AppNavbar from './AppNavbar';
import AppSpinner from './AppSpinner';
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
      isLoading: true,
      currentStudentId: ''};
    this.toggleAttendance = this.toggleAttendance.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    this.setState({isLoading: true});
    fetch(`/api/course/${this.props.match.params.id}/students`)
        .then(response => response.json())
        .then(data => {
          this.setState({students: data})
          this.collectStudentsIds(data)
        });
    fetch(`/api/course/${this.props.match.params.id}/lessons`)
        .then(response => response.json())
        .then(data => {this.setState({lessons: data, isLoading: false})});
  }

  async handleSubmit(event) {
    event.preventDefault();
    let item = {...this.state.item};
    let students = this.state.attendantStudentsIds
    item["attendantStudents"] = students
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

  toggleAttendance(stFileNumber) {
    let student = {fileNumber: stFileNumber}
    let studentList = this.state.attendantStudentsIds
    Log.info('Old attendants are ' + studentList)
    if (studentList.filter(st => st.fileNumber === stFileNumber).length === 0) {
      Log.info('Toggle attend id ' + stFileNumber)
      studentList = studentList.concat(student)
    }
    else {
      Log.info('Toggle unattend id ' + stFileNumber)
      const newStudentList = studentList.filter(st => st.fileNumber !== stFileNumber)
      studentList = newStudentList
    }
    this.setState({attendantStudentsIds: studentList})
    Log.info('New attendants are ' + studentList)
  }

  render() {
    const {students, isLoading} = this.state;
    if (isLoading) { return (<AppSpinner></AppSpinner>) }
    const studentList = students.map((student) => {
      let fileNumber = student.fileNumber
      return ( <tr onClick={() => {this.toggleAttendance(fileNumber)}} 
        id={fileNumber} style={this.setRowColor(fileNumber)} key={fileNumber}>
        <td style={{whiteSpace: 'nowrap'}}>{fileNumber || ''}</td>
        <td style={{whiteSpace: 'nowrap'}}>{student.personalData.firstName || ''}</td>
        <td style={{whiteSpace: 'nowrap'}}>{student.personalData.lastName || ''}</td>
        <td style={{textAlign: 'center'}}> {this.getIcon(fileNumber)}</td>
      </tr>
      )
    });

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
          <Form onSubmit={this.handleSubmit}>
            <ButtonGroup>
                <Button color="primary" type="submit" id="saveAttendance">
                  <UncontrolledTooltip placement="auto" target="saveAttendance">
                    Save Attendance
                  </UncontrolledTooltip>
                  <FontAwesomeIcon icon={['fas', 'save']} size="2x"/>
                </Button>{' '}
                <Button color="secondary" tag={Link} to="/courses" id="backToCourse">
                  <UncontrolledTooltip placement="auto" target="backToCourse">
                    Discard and Back to Course
                  </UncontrolledTooltip>
                  <FontAwesomeIcon icon={['fas', 'backward']} size="2x"/>
                </Button>
            </ButtonGroup>
          </Form>
          </div>
          <h3>Students</h3>
          <Table className="mt-4">
            <thead>
            <tr>
              <th width="10%">File Number</th>
              <th width="20%">First Name</th>
              <th width="20%">Last Name</th>
              <th width="3%">Attended</th>
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

  // takes the list of students from api and sets the list of student fileNumbers in state
  collectStudentsIds(students) {
    const emptyStudent = {fileNumber: ''}
    let students4JSON = students.map(student => {return emptyStudent.fileNumber = student})
    Log.info('NEW ' + students4JSON)
    this.setState({attendantStudentsIds: students4JSON})
  }

  setRowColor(rowId) {
    if (this.state.attendantStudentsIds.filter(st => st.fileNumber === rowId).length === 0) {
      return {backgroundColor:'#FFF0F5'}
    }
    else { return {backgroundColor:'#F0FFF0'} }
  }

  getIcon(fileNumber) {
    if (this.state.attendantStudentsIds.filter(st => st.fileNumber === fileNumber).length === 0) {
      return <FontAwesomeIcon icon='times' size="2x" color='#CD5C5C' />
    }
    else { return <FontAwesomeIcon icon='check' size="2x" color='#90EE90'/> } 
  }
}

export default Attendance;