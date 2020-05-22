import React, { Component } from 'react';
import { Container, Table, ButtonGroup, Button, UncontrolledTooltip, Form } from 'reactstrap';
import AppSpinner from './AppSpinner';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import DetailButton from './buttonBar/DetailButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as BackAPI from './BackAPI';

class AddStudentsToCourse extends Component {

  emptyItem = {
    courseName: '',
    courseCode: '',
    courseShift: '',
    courseIsOpen: '',
    subject: {
        code: ''
    },
    students: []
  };

  constructor(props) {
    super(props);
    this.state = {
      courseStudentsIds: [], 
      students: [],
      item: this.emptyItem,
      isLoading: true,
      currentStudentId: ''};
    this.toggleInscription = this.toggleInscription.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});
    BackAPI.getCourseByIdAsync(this.props.match.params.id, json => this.setState({item: json}), null);
    BackAPI.getStudentsAsync(json => {
      this.setState({students: json, isLoading: false})
      this.collectStudentsIds(json)},
      null); // TODO: replace null by error showing code
  }

  async handleSubmit(event) {
    event.preventDefault();
    // const {item} = this.state;
    let item = {...this.state.item};
    let students = this.state.courseStudentsIds
    item['students'] = students
    this.setState({item: item})
    BackAPI.postCourseAsync(item, () => this.props.history.push('/courses'), null); // TODO: replace null by error showing code
  }

  toggleInscription(stFileNumber) {
    let student = {fileNumber: stFileNumber}
    let studentList = this.state.courseStudentsIds
    if (studentList.filter(st => st.fileNumber === stFileNumber).length === 0) {
      studentList = studentList.concat(student)
    }
    else {
      const newStudentList = studentList.filter(st => st.fileNumber !== stFileNumber)
      studentList = newStudentList
    }
    this.setState({courseStudentsIds: studentList})
  }

  // takes the list of students from api and sets the list of student fileNumbers in state
  collectStudentsIds(students) {
    const emptyStudent = {fileNumber: ''}
    let students4JSON = students.map(student => {return emptyStudent.fileNumber = student})
    this.setState({courseStudentsIds: students4JSON})
  }

  render() {
    const {isLoading} = this.state;
    if (isLoading) { return <AppSpinner /> }
    const targetId = this.state.currentStudentId
    return (
      <div>
        <AppNavbar/>
        <Container fluid> 
          <Form onSubmit={this.handleSubmit}>
            <ButtonGroup className="float-right" inline="true">
              <Button size="sm" color="primary" type="submit" id='addStudentToCourse'>
                <UncontrolledTooltip placement="auto" target='addStudentToCourse'>
                  Save Course Adding Selected Students
                </UncontrolledTooltip>
                <FontAwesomeIcon icon="save" size="2x"/>
              </Button>
              <DetailButton entityTypeCapName = {'Student'} targetId = {targetId} to = {`/student/${targetId}/detail`}/>
              <Button  size="sm" color="secondary" tag={Link} to="/courses" id="backToCourse">
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
                students = {this.state.students}
                studentOnClickFunction = {(fileNumber) => {this.toggleInscription(fileNumber)}}
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
    if (this.state.courseStudentsIds.filter(st => st.fileNumber === fileNumber).length === 0) {
      return <FontAwesomeIcon icon='times' size="2x" color='#CD5C5C' />
    }
    else { return <FontAwesomeIcon icon='check' size="2x" color='#90EE90'/> } 
  }

  setRowColor(rowId) {
    if (this.state.courseStudentsIds.filter(st => st.fileNumber === rowId).length === 0) {
      return {backgroundColor:'#FFF0F5'}
    }
    else { return {backgroundColor:'#F0FFF0'} }
  }
}

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
    <td style={{whiteSpace: 'nowrap'}}>{props.student.personalData.dni || ''}</td>
    <td style={{whiteSpace: 'nowrap'}}>{props.student.personalData.firstName || ''}</td>
    <td style={{whiteSpace: 'nowrap'}}>{props.student.personalData.lastName || ''}</td>
    <td style={{whiteSpace: 'nowrap'}}>{props.student.personalData.email || ''}</td>
    <td style={{whiteSpace: 'nowrap'}}>{props.student.personalData.cellPhone || ''}</td>
    <td style={{textAlign: 'center'}}> {props.getIconFunction(props.student.fileNumber)}</td>
  </tr>;

export default AddStudentsToCourse;
