import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table, Form, UncontrolledTooltip } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AppNavbar from './AppNavbar';
import AppSpinner from './AppSpinner';
import * as BackAPI from './BackAPI';

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

  componentDidMount() {
    this.setState({isLoading: true});
    let courseId = this.props.match.params.id
    BackAPI.getCourseStudentsAsync(courseId, json => { 
      this.setState({students: json}) 
      this.collectStudentsIds(json)}, 
      null); // TODO: replace null by error showing code
    BackAPI.getCourseLessonsAsync(courseId, json => this.setState({lessons: json, isLoading:false }), null) // TODO: replace null by error showing code
  }

  async handleSubmit(event) {
    event.preventDefault();
    let item = {...this.state.item};
    let students = this.state.attendantStudentsIds
    item['attendantStudents'] = students
    this.setState({item: item})
    BackAPI.postLessonAsync(item, () => this.props.history.push('/courses'), null); // TODO: replace null by error showing code
  }

  toggleAttendance(stFileNumber) {
    let student = {fileNumber: stFileNumber}
    let studentList = this.state.attendantStudentsIds
    if (studentList.filter(st => st.fileNumber === stFileNumber).length === 0) {
      studentList = studentList.concat(student)
    }
    else {
      const newStudentList = studentList.filter(st => st.fileNumber !== stFileNumber)
      studentList = newStudentList
    }
    this.setState({attendantStudentsIds: studentList})
  }

  // takes the list of students from api and sets the list of student fileNumbers in state
  collectStudentsIds(students) {
    const emptyStudent = {fileNumber: ''}
    let students4JSON = students.map(student => {return emptyStudent.fileNumber = student})
    this.setState({attendantStudentsIds: students4JSON})
  }

  render() {
    const {isLoading} = this.state;
    if (isLoading) { return <AppSpinner/> }
    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <Form onSubmit={this.handleSubmit}>
            <ButtonGroup className="float-right" inline="true">
              <Button size="sm" color="primary" type="submit" id="saveAttendance">
                <UncontrolledTooltip placement="auto" target="saveAttendance">
                  Save Attendance
                </UncontrolledTooltip>
                <FontAwesomeIcon icon='save' size="2x"/>
              </Button>
              <Button size="sm"  color="secondary" tag={Link} to="/courses" id="backToCourse">
                <UncontrolledTooltip placement="auto" target="backToCourse">
                  Discard and Back to Course
                </UncontrolledTooltip>
                <FontAwesomeIcon icon='backward' size="2x"/>
              </Button>
            </ButtonGroup>
          </Form>
          <h3>Students</h3>
          <Table className="mt-4">
            <StudentListHeaders />
            <tbody>
              <StudentList
                students = {this.state.students}
                studentOnClickFunction = {(fileNumber) =>  {this.toggleAttendance(fileNumber)}}
                styleFunction = {(fileNumber) => this.setRowColor(fileNumber)} 
                getIconFunction = {(fileNumber) => this.getCourseIcon(fileNumber)}
              />
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }

  getCourseIcon(fileNumber) {
    if (this.state.attendantStudentsIds.filter(st => st.fileNumber === fileNumber).length === 0) {
      return <FontAwesomeIcon icon='times' size="2x" color='#CD5C5C' />
    }
    else { return <FontAwesomeIcon icon='check' size="2x" color='#90EE90'/> } 
  }

  setRowColor(rowId) {
    if (this.state.attendantStudentsIds.filter(st => st.fileNumber === rowId).length === 0) {
      return {backgroundColor:'#FFF0F5'}
    }
    else { return {backgroundColor:'#F0FFF0'} }
  }
}

const StudentListHeaders = () =>
  <thead>
    <tr>
      <th width="10%">File Number</th>
      <th width="20%">First Name</th>
      <th width="20%">Last Name</th>
      <th width="3%">Attended</th>
    </tr>
  </thead>;

const StudentList = props => {
  return props.students.map( (student, index) => {
    const studentOnClickFunction = () => props.studentOnClickFunction(student.fileNumber);
    const getIconFunction = (fileNumber) => props.getIconFunction(fileNumber);
    return (
      <StudentListItem
        key = {index}
        student = {student} 
        studentOnClickFunction = {studentOnClickFunction} 
        style = {props.styleFunction(student.fileNumber)}
        getIconFunction = {getIconFunction}
      />
    )
  });
}

const StudentListItem = props =>
  <tr onClick={props.studentOnClickFunction} id={props.student.fileNumber} style={props.style}>
    <td style={{whiteSpace: 'nowrap'}}>{props.student.fileNumber || ''}</td>
    <td style={{whiteSpace: 'nowrap'}}>{props.student.personalData.firstName || ''}</td>
    <td style={{whiteSpace: 'nowrap'}}>{props.student.personalData.lastName || ''}</td>
    <td style={{textAlign: 'center'}}> {props.getIconFunction(props.student.fileNumber)}</td>
  </tr>;

export default Attendance;