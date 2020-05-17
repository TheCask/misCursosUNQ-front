import React, { Component } from 'react';
import { Container, Table} from 'reactstrap';
import AppSpinner from './AppSpinner';
import AppNavbar from './AppNavbar';
import ButtonBar from './buttonBar/ButtonBar';
import * as BackAPI from './BackAPI';

class StudentListContainer extends Component {

  render() {
    return(
    <div>
      <AppNavbar/>
      <StudentList 
        studentListTitle = {'Students'}
        onGetAllFunction = {BackAPI.getStudents}
        onGetAllFixArgs = {[]}
        onDeleteBackAPIFunction = {BackAPI.deleteStudent}
        onDeleteFixArgs = {[]}
        onDeleteConsequenceList = {[
          "The student will no longer be available.",
          "The student will be removed of every current course as well as any previous he ever took.",
          "The student's attendance to any lesson (current or previous) will be removed."
        ]}
      />
    </div>
    )
  }
}

export class StudentList extends Component {

  constructor(props) {
    super(props);
    this.title = this.props.studentListTitle;
    this.state = {students: [], isLoading: true, targetId: ''};
    this.contextParams = props;
  }

  componentDidMount() {
    const onGetAllFixArgs = this.contextParams.onGetAllFixArgs;
    this.setState({isLoading: true});
    this.contextParams.onGetAllFunction(...onGetAllFixArgs, json => this.setState({students: json, isLoading: false}));
  }

  remove(studentId) {
    const onDeleteFixArgs = this.contextParams.onDeleteFixArgs;
    this.contextParams.onDeleteBackAPIFunction(studentId, ...onDeleteFixArgs, () => {
      let updatedStudents = [...this.state.students].filter(student => student.fileNumber !== studentId);
      this.setState({students: updatedStudents});
    });
  }

  setSelectedRowColor(rowId) {
    if (rowId === this.state.targetId) {
      return {backgroundColor:'#F0F8FF'}
    }
  }

  renderStudents(){
    const studentsJson = this.state.students;
    const studentsJSX = studentsJson.map(student => {
      const studentOnClickFunction = () => {this.setState({targetId: student.fileNumber})}
      return (
        <StudentListItem 
          student = {student} 
          studentOnClickFunction = {studentOnClickFunction} 
          style = {this.setSelectedRowColor(student.fileNumber)} 
        />
      )
    });
    return studentsJSX;
  }

  render() {

    const isLoading = this.state.isLoading;

    if (isLoading) { 
      return (<AppSpinner></AppSpinner>) 
    }

    const deleteStudentFunction = () => {this.remove(this.state.targetId)};

    return (
      <div>
        <Container fluid>     
          <ButtonBar 
            entityType='student' 
            targetId = {this.state.targetId} 
            deleteEntityFunction = {deleteStudentFunction} 
            consequenceList = {this.contextParams.onDeleteConsequenceList} />  
          <h3>{this.title}</h3>
          <Table hover className="mt-4">
            <StudentListHeaders />
            <tbody>
              {this.renderStudents()}
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
      <th width="7%">File Number</th>
      <th width="10%">DNI</th>
      <th width="5%">First Name</th>
      <th width="5%">Last Name</th>
      <th width="2%">e-Mail</th>
      <th width="2%">Cell Phone</th>
    </tr>
  </thead>;

const StudentListItem = props => 
    <tr onClick={props.studentOnClickFunction} id={props.student.fileNumber} style={props.style}> 
      <td style={{whiteSpace: 'nowrap'}}>{props.student.fileNumber || ''}</td>
      <td style={{whiteSpace: 'nowrap'}}>{props.student.personalData.dni || ''}</td>
      <td style={{whiteSpace: 'nowrap'}}>{props.student.personalData.firstName || ''}</td>
      <td style={{whiteSpace: 'nowrap'}}>{props.student.personalData.lastName || ''}</td>
      <td style={{whiteSpace: 'nowrap'}}>{props.student.personalData.email || ''}</td>
      <td style={{whiteSpace: 'nowrap'}}>{props.student.personalData.cellPhone || ''}</td>
    </tr>;

export default StudentListContainer;
