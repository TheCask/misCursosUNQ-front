import React, { Component } from 'react';
import { Container, Table, ButtonGroup, Button, UncontrolledTooltip } from 'reactstrap';
import AppSpinner from './AppSpinner';
import AppNavbar from './AppNavbar';
import DetailButton from './buttonBar/DetailButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as BackAPI from './BackAPI';

class AddStudentsToCourse extends Component {

  emptyItem = {
    course: {
      courseId: this.props.match.params.id
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
    BackAPI.getStudentsAsync(json => this.setState({students: json, isLoading: false}), null); // TODO: replace null by error showing code
  }

  async handleSubmit(event) {
    event.preventDefault();
    // const {item} = this.state;
    let item = {...this.state.item};
    let students = this.state.courseStudentsIds
    item["students"] = students
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

  setSelectedRowColor(rowId) {
    if (rowId === this.state.currentStudentId) {
      return {backgroundColor:'#F0F8FF'}
    }
  }

  handleAddStudent(event) {
    const {name, value} = event.target;
    let item = {...this.state.item};
    this.setInnerPropValue(item, name, value);
    item['lessons'] = []
    this.setState({item});
  }

  render() {
    const isLoading = this.state.isLoading;
    if (isLoading) { return (<AppSpinner />) }
    const targetId = this.props.currentStudentId;
    return (
      <div>
        <AppNavbar/>
        <Container fluid> 
          <ButtonGroup className="float-right" inline="true">
          <Button 
            id='addStudentToCourse'
            color="success" 
            onClick={this.handleAddStudent} >
            <UncontrolledTooltip placement="auto" target='addStudentToCourse'>
                Add selected Student to Course
            </UncontrolledTooltip>
              <FontAwesomeIcon icon="user-graduate" size="1x"/>
              <FontAwesomeIcon icon="plus-circle" size="1x" transform="right-5 up-5"/>
          </Button>
          <DetailButton
                  entityTypeCapName = {'Student'}
                  targetId = {targetId}
                  to = {`/student/${targetId}/detail`}/>
          </ButtonGroup>
          <h3>Add Students to Course</h3>
          <Table hover className="mt-4"> 
            <StudentListHeaders />
            <tbody>
              <StudentList 
                students = {this.state.students}
                studentOnClickFunction = {(studentId) =>  {this.setState({currentStudentId: studentId})}}
                styleFunction = {(studentId) => this.setSelectedRowColor(studentId)} 
              />
            </tbody>
          </Table>
        </Container>
      </div>
    );
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
    </tr>
  </thead>;

const StudentList = props => {
  return props.students.map( (student, index) => {
    const studentOnClickFunction = () => props.studentOnClickFunction(student.fileNumber);
    return (
      <StudentListItem
        key = {index}
        student = {student} 
        studentOnClickFunction = {studentOnClickFunction} 
        style = {props.styleFunction(student.fileNumber)}
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
  </tr>;

export default AddStudentsToCourse;
