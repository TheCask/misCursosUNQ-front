import React from 'react';
import { Container, Table, ButtonGroup, Button, UncontrolledTooltip, Form } from 'reactstrap';
import AppSpinner from '../auxiliar/AppSpinner';
import AppNavbar from '../AppNavbar';
import { Link } from 'react-router-dom';
import DetailButton from '../buttons/DetailButton';
import { userContext } from '../login/UserContext';
import AccessError from '../errorHandling/AccessError';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as CourseAPI from '../services/CourseAPI';
import * as StudentAPI from '../services/StudentAPI';
import ComponentWithErrorHandling from '../errorHandling/ComponentWithErrorHandling';
import * as Constants from '../auxiliar/Constants'

class AddStudentsToCourse extends ComponentWithErrorHandling {

  constructor(props) {
    super(props);
    this.state = {
      courseStudentsIds: [], 
      allStudents: [],
      item: Constants.emptyCourse,
      isLoading: true,
      currentStudentId: ''};
    this.toggleInscription = this.toggleInscription.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});
    CourseAPI.getCourseByIdAsync(this.props.match.params.id, 
      json => this.setState({item: json}), 
      this.showError("get course"));
    StudentAPI.getStudentsAsync(json => {
      this.collectStudentsIds(this.state.item.students);
      this.setState({allStudents: json, isLoading: false})
      },
      this.showError("get students"));
  }

  async handleSubmit(event) {
    event.preventDefault();
    // const {item} = this.state;
    let item = {...this.state.item};
    let students = this.state.courseStudentsIds
    item['students'] = students
    item['lessons'] = []
    this.setState({item: item})
    CourseAPI.postCourseAsync(item,
      () => this.props.history.push(`/course/${item.courseId}`),
      this.showError("save course"));
  }

  toggleInscription(stFileNumber) {
    let courseStudents = this.state.item.students
    if (!courseStudents.find(st => st.fileNumber === stFileNumber)) {
      let studentList = this.state.courseStudentsIds
      let student = {fileNumber: stFileNumber}
      if (studentList.find(st => st.fileNumber === stFileNumber)) {
        const newStudentList = studentList.filter(st => st.fileNumber !== stFileNumber)
        studentList = newStudentList
      }
      else { studentList = studentList.concat(student) }
      this.setState({courseStudentsIds: studentList})
    }
  }

  // takes the list of course students from api and sets the list of student fileNumbers in state
  collectStudentsIds(students) {
    let students4JSON = students.map(student => {
      return {fileNumber: student['fileNumber']}
      })
    this.setState({courseStudentsIds: students4JSON})
  }

  render() {
    const {isLoading} = this.state;
    if (isLoading) { return <AppSpinner /> }
    const targetId = this.state.currentStudentId
    this.actualRol = this.context.actualRol;
    return (this.actualRol === 'Guest' ?
      <AccessError errorCode="Guests are not allowed" 
          errorDetail="Make sure you are signed in with valid role before try to access this page"/>
      : 
      <div>
        <AppNavbar>
          <Container fluid> 
            <Form onSubmit={this.handleSubmit}>
              <ButtonGroup className="float-right" inline="true">
                <Button size="sm" color="primary" type="submit" id='addStudentToCourse'>
                  <UncontrolledTooltip placement="auto" target='addStudentToCourse'>
                    Add Selected Students to Course
                  </UncontrolledTooltip>
                  <FontAwesomeIcon icon="save" size="2x"/>
                </Button>
                <DetailButton entityTypeCapName = {'Student'} targetId = {targetId} to = {`/student/${targetId}/detail`}/>
                <Button  size="sm" color="secondary" tag={Link} to={`/course/${this.state.item.courseId}`} id="backToCourse">
                  <UncontrolledTooltip placement="auto" target="backToCourse">
                    Discard and Back to Course
                  </UncontrolledTooltip>
                  <FontAwesomeIcon icon='backward' size="2x"/>
                </Button>
                </ButtonGroup>
            </Form>
            <h3>Add Students to Course</h3>
            <Table className="mt-4"> 
              <StudentListHeaders />
              <tbody>
                <StudentList
                  courseStudentsIds = {this.state.courseStudentsIds}
                  allStudents = {this.state.allStudents}
                  studentOnClickFunction = {(fileNumber) => {this.toggleInscription(fileNumber)}}
                  styleFunction = {(fileNumber) => this.setRowColor(fileNumber)}
                  setIconFunction = {(fileNumber) => this.setRowIcon(fileNumber)}
                />
              </tbody>
            </Table>
          </Container>
        </AppNavbar>
      </div>
    );
  }

  setRowIcon(fileNumber) {
    if (this.state.courseStudentsIds.find(st => st.fileNumber === fileNumber)) {
      return <FontAwesomeIcon icon='check' size="2x" color='#90EE90'/>
    }
    else { return <FontAwesomeIcon icon='times' size="2x" color='#CD5C5C' /> } 
  }

  setRowColor(rowId) {
    if (this.state.courseStudentsIds.find(st => st.fileNumber === rowId)) {
      return {backgroundColor:'#F0FFF0'}
    }
    else { return {backgroundColor:'#FFF0F5'} }
  }
}
AddStudentsToCourse.contextType = userContext;

const StudentListHeaders = () =>
  <thead>
    <tr>
      <th width="7%" >File Number</th>
      <th width="10%">DNI</th>
      <th width="5%" >First Name</th>
      <th width="5%" >Last Name</th>
      <th width="2%" >e-Mail</th>
      <th width="2%" >Cell Phone</th>
      <th width="3%">Selected</th>
    </tr>
  </thead>;

const StudentList = props => {
  return props.allStudents.map( (student, index) => {
    const studentOnClickFunction = () => props.studentOnClickFunction(student.fileNumber);
    const setIconFunction = (fileNumber) => props.setIconFunction(fileNumber);
    return (
      <StudentListItem
        key = {index}
        student = {student} 
        studentOnClickFunction = {studentOnClickFunction} 
        style = {props.styleFunction(student.fileNumber)}
        setIconFunction = {setIconFunction}
      />
    )
  });
}

const tr = {whiteSpace: 'nowrap'}
const StudentListItem = props => 
  <tr onClick={props.studentOnClickFunction} id={props.student.fileNumber} style={props.style}> 
    <td style={tr}>{props.student.fileNumber || ''}</td>
    <td style={tr}>{props.student.personalData.dni || ''}</td>
    <td style={tr}>{props.student.personalData.firstName || ''}</td>
    <td style={tr}>{props.student.personalData.lastName || ''}</td>
    <td style={tr}>{props.student.personalData.email || ''}</td>
    <td style={tr}>{props.student.personalData.cellPhone || ''}</td>
    <td style={tr}> {props.setIconFunction(props.student.fileNumber)}</td>
  </tr>;

export default AddStudentsToCourse;
