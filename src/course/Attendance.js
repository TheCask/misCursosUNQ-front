import React from 'react';
import { userContext } from '../login/UserContext';
import { Button, ButtonGroup, Container, Table, Form, UncontrolledTooltip } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AppNavbar from '../AppNavbar';
import AppSpinner from '../auxiliar/AppSpinner';
import DatePicker from "react-datepicker";
import AccessError from '../errorHandling/AccessError';
import ComponentWithErrorHandling from '../errorHandling/ComponentWithErrorHandling'
import * as CourseAPI from '../services/CourseAPI';
import * as LessonAPI from '../services/LessonAPI';
import * as Constants from '../auxiliar/Constants'
import "react-datepicker/dist/react-datepicker.css";

const truncTime = date => { 
  date.setHours(0,0,0,0) 
  return date;
}

class Attendance extends ComponentWithErrorHandling {

  emptyItem = {
    lessonId: '',
    course: {
      courseId: this.props.match.params.id
    },
    lessonDay: truncTime(new Date()),
    attendantStudents: []
  };

  constructor(props) {
    super(props);
    this.state = {...this.state, ...{
      attendantStudentsIds: [], 
      students: [], 
      lessons: [], 
      item: this.emptyItem,
      isLoading: true,
      currentStudentId: ''
    }};
    this.toggleAttendance = this.toggleAttendance.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});
    let courseId = this.props.match.params.id
    CourseAPI.getCourseStudentsAsync(
      courseId, 
      json => { 
        this.setState({students: json}) 
        this.collectStudentsIds(json)}, 
      this.showError("get course students")
    ); 
    CourseAPI.getCourseLessonsAsync(
      courseId, 
      json => {
        let jsonWithParsedDates = json.map( (lesson, index) => {
          let parsedDate = new Date( lesson.lessonDay.replace("-","/") );
          let newLesson = {...lesson};
          newLesson.lessonDay = parsedDate;
          return newLesson;
        });
        this.setState({lessons: jsonWithParsedDates, isLoading:false })
        this.emptyItem.attendantStudents = [...this.state.students];
      }, 
      this.showError("get course lessons")
    );
  }

  async handleSubmit(event) {
    event.preventDefault();
    let item = {...this.state.item};
    let students = this.state.attendantStudentsIds;
    item['attendantStudents'] = students;
    this.setState({item: item});
    LessonAPI.postLessonAsync(item, 
      () => this.props.history.push('/courses'), 
      this.showError("save lesson")); 
  }

  toggleAttendance(stFileNumber) {
    let student = {fileNumber: stFileNumber}
    let studentList = this.state.attendantStudentsIds
    if (studentList.find(st => st.fileNumber === stFileNumber)) {
      const newStudentList = studentList.filter(st => st.fileNumber !== stFileNumber)
      studentList = newStudentList
    }
    else { studentList = studentList.concat(student) }
    this.setState({attendantStudentsIds: studentList})
  }

  // takes the list of students from api and sets the list of student fileNumbers in state
  collectStudentsIds(students) {
    let students4JSON = students.map(student => {
      return {fileNumber: student['fileNumber']}
      })
    this.setState({attendantStudentsIds: students4JSON})
  }

  itemDisplayFunc(lesson){
    return getDisplayFormat(lesson.lessonDay)
  }

  handleDateChange = date => {
    let lessonFound = this.state.lessons.find( lesson => this.isSameDate(lesson.lessonDay, date) );
    if (!lessonFound) {
      this.emptyItem.lessonDay = truncTime(date);
      lessonFound = this.emptyItem;
    }
    this.setState({item: lessonFound, attendantStudentsIds: lessonFound.attendantStudents});
  }

  isSameDate = (d1, d2) => {
    return d1.getDate() === d2.getDate() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getFullYear() === d2.getFullYear();
  }

  render() {
    const {isLoading} = this.state;
    if (isLoading) { return <AppSpinner/> }
    this.actualRol = this.context.actualRol;
    return (this.actualRol !== 'Teacher' ?
      <AccessError errorCode="Only Teachers are allowed" 
          errorDetail="Make sure you are signed in with valid role before try to access this page"/>
      :
      <AppNavbar>
        {this.renderErrorModal()}
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
                  Discard and Back to Courses
                </UncontrolledTooltip>
                <FontAwesomeIcon icon='backward' size="2x"/>
              </Button>
            </ButtonGroup>
            <ButtonGroup className="float-right" inline="true" style={{padding: "5px 20px"}}>
              <DatePicker 
                selected = {this.state.item.lessonDay}
                maxDate={ truncTime(new Date()) }
                onChange = {this.handleDateChange}
                highlightDates = {this.getLessonDates()}
              />
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
      </AppNavbar>
    );
  }

  getLessonDates() {
    return this.state.lessons.map((lesson) => lesson.lessonDay);
  }

  getCourseIcon(fileNumber) {
    if (this.state.attendantStudentsIds.find(st => st.fileNumber === fileNumber)) {
      return <FontAwesomeIcon icon='check' size="2x" color='#90EE90'/>
    }
    else { return <FontAwesomeIcon icon='times' size="2x" color='#CD5C5C' /> } 
  }

  setRowColor(rowId) {
    if (this.state.attendantStudentsIds.find(st => st.fileNumber === rowId)) {
      return {backgroundColor:'#F0FFF0'}
    }
    else { return {backgroundColor:'#FFF0F5'} }
  }
}
Attendance.contextType = userContext;

const th = Constants.tableHeader
const StudentListHeaders = () =>
  <thead>
    <tr>
      <th style={th}>File Number</th>
      <th style={th}>First Name</th>
      <th style={th}>Last Name</th>
      <th style={th}>Attended</th>
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

const getDisplayFormat = date => {
  var dd = String(date.getDate()).padStart(2, '0');
  var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = date.getFullYear();

  date = yyyy + '-' + mm + '-' + dd;
  return date;
}

const tr = Constants.tableRow
const StudentListItem = props =>
  <tr onClick={props.studentOnClickFunction} id={props.student.fileNumber} style={props.style}>
    <td style={tr}>{props.student.fileNumber || ''}</td>
    <td style={tr}>{props.student.personalData.firstName || ''}</td>
    <td style={tr}>{props.student.personalData.lastName || ''}</td>
    <td style={{textAlign: 'center'}}> {props.getIconFunction(props.student.fileNumber)}</td>
  </tr>;

export default Attendance;