import React, { Component } from 'react';
import { Container, Table } from 'reactstrap';
import AppSpinner from './AppSpinner';
import AppNavbar from './AppNavbar';
import ButtonBar from './buttonBar/ButtonBar';
import * as StudentAPI from './services/StudentAPI';

class FullStudentList extends Component {
  render() {
    return(
      <div>
        <AppNavbar>
          <StudentListContainer 
                  studentListTitle = {'Students'}
                  addButtonTo = {`/student/new`}
                  onGetAll = { (handleSuccess, handleError) => StudentAPI.getStudentsAsync(handleSuccess, handleError) }
                  onDelete = { (studentId, handleSuccess, handleError) => StudentAPI.deleteStudentAsync(studentId, handleSuccess, handleError)}
                  onDeleteConsequenceList = {[
                    "The student will no longer be available.",
                    "The student will be removed of every current course as well as any previous he ever took.",
                    "The student's attendance to any lesson (current or previous) will be removed."
                  ]}
                  />
        </AppNavbar>
      </div>
    )
  }
}

export class StudentListContainer extends Component {

  constructor(props) {
    super(props);
    this.title = this.props.studentListTitle;
    this.state = {students: [], isLoading: true, targetId: ''};
    this.addButtonTo = props.addButtonTo;
    this.contextParams = props;
  }

  componentDidMount() {
    this.setState({isLoading: true});
    this.contextParams.onGetAll(json => this.setState({students: json, isLoading: false}, null )); // TODO: replace null by error showing code
  }

  remove(studentId) {
    this.contextParams.onDelete(
      studentId, 
      () => {
        let updatedStudents = [...this.state.students].filter(student => student.fileNumber !== studentId);
        this.setState({students: updatedStudents, targetId: ''});
      },
      null // TODO: replace null by error showing code
    );
  }

  setSelectedRowColor(rowId) {
    if (rowId === this.state.targetId) {
      return {backgroundColor:'#F0F8FF'}
    }
  }

  render() {
    const isLoading = this.state.isLoading;
    if (isLoading) { return (<AppSpinner />) }
    const deleteStudentFunction = () => {this.remove(this.state.targetId)};
    return (
      <div>
        <Container fluid> 
          <ButtonBar
            entityType='student' 
            targetId = {this.state.targetId} 
            deleteEntityFunction = {deleteStudentFunction} 
            consequenceList = {this.contextParams.onDeleteConsequenceList}
            addButtonTo = {this.addButtonTo}
          />
          <h3>{this.title}</h3>
          <Table hover className="mt-4"> 
            <StudentListHeaders />
            <tbody>
              <StudentList 
                students = {this.state.students}
                studentOnClickFunction = {(studentId) =>  {this.setState({targetId: studentId})}}
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

export default FullStudentList;
