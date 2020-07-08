import React from 'react';
import { Container, Table, InputGroup, Button, Input, 
  InputGroupAddon, Col, Row, UncontrolledTooltip } from 'reactstrap';
import AppSpinner from '../auxiliar/AppSpinner';
import AppNavbar from '../AppNavbar';
import ButtonBar from '../buttons/ButtonBar';
import { userContext } from '../login/UserContext';
import AccessError from '../errorHandling/AccessError'
import * as StudentAPI from '../services/StudentAPI';
import ComponentWithErrorHandling from '../errorHandling/ComponentWithErrorHandling'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class FullStudentList extends ComponentWithErrorHandling {
  render() {
    this.actualRol = this.context.actualRol;
    return (this.actualRol !== 'Cycle Coordinator' ?
      <AccessError errorCode="Guests are not allowed" 
          errorDetail="Make sure you are signed in with valid role before try to access this page"/>
      :
      <div>
        <AppNavbar>
          {this.renderErrorModal()}
          <StudentListContainer 
            studentListTitle = {'Students'}
            addButtonTo = {`/student/new`}
            renderEditButton = {true}
            renderAddButton = {true}
            renderDeleteButton = {true}
            renderButtonBar = {this.context.actualRol === 'Cycle Coordinator'}
            onGetAll = { (handleSuccess, handleError) => 
              StudentAPI.getStudentsAsync(handleSuccess, handleError) }
            onDelete = { (studentId, handleSuccess, handleError) => 
              StudentAPI.deleteStudentAsync(studentId, handleSuccess, handleError)}
            onSearch = {(page, text, handleSuccess, handleError) => 
              StudentAPI.searchStudentsAsync(page, text.toLowerCase(), handleSuccess, handleError)}
            renderSearch = {true}
            onDeleteConsequenceList = {[
              "The student will no longer be available.",
              "The student will be removed of every current course as well as any previous he ever took.",
              "The student's attendance to any lesson (current or previous) will be removed.",
              "The student's califications in any evaluation (current or previous) will be removed"
            ]}
            />
        </AppNavbar>
      </div>
    )
  }
}

export class StudentListContainer extends ComponentWithErrorHandling {

  constructor(props) {
    super(props);
    this.state = {...this.state, ...{
      students: [], isLoading: true, targetId: '', searchText: '', pageNo: 1}};
    this.title = this.props.studentListTitle;
    this.addButtonTo = props.addButtonTo;
    this.renderButtonBar = props.renderButtonBar;
    this.renderAddButton = props.renderAddButton;
    this.renderDeleteButton = props.renderDeleteButton;
    this.renderEditButton = props.renderEditButton;
    this.contextParams = props;
    this.renderSearch = props.renderSearch
    this.handleChange = this.handleChange.bind(this)
    this.doSearch = this.doSearch.bind(this)
  }

  componentDidMount() {
    this.setState({isLoading: true});
    this.contextParams.onGetAll(json => this.setState({students: json, isLoading: false}), 
      this.showError("get students"));
  }

  remove(studentId) {
    this.contextParams.onDelete(
      studentId, 
      () => {
        let updatedStudents = [...this.state.students].filter(student => student.fileNumber !== studentId);
        this.setState({students: updatedStudents, targetId: ''});
      },
      this.showError("remove student"));
  }

  doSearch() {
    this.setState({isLoading: true});
    this.contextParams.onSearch(
      this.state.pageNo,
      this.state.searchText,
      json => this.setState({students: json, isLoading: false}),
      this.showError("search students"));
  }

  handleChange(event) {
    const {name, value} = event.target;
    this.setState({[name]: value});
  }

  setSelectedRowColor(rowId) {
    if (rowId === this.state.targetId) {
      return {backgroundColor:'#F0F8FF'}
    }
  }

  render() {
    const {isLoading} = this.state;
    if (isLoading) { return (<AppSpinner />) }
    const deleteStudentFunction = () => {this.remove(this.state.targetId)};
    return (
      <div>
        {this.renderErrorModal()}
        <Container fluid>
          <Row xs="4">
            <Col> <h3>{this.title}</h3> </Col>
              <Col xs="6"> 
                {this.renderSearch ?  <SearchField 
                  doSearch = {this.doSearch}
                  searchText = {this.state.searchText}
                  handleChange = {this.handleChange}/>
                  : null}
              </Col>
            <Col>
              { this.renderButtonBar ?
              <ButtonBar
                entityType='student' 
                targetId = {this.state.targetId} 
                deleteEntityFunction = {deleteStudentFunction} 
                consequenceList = {this.contextParams.onDeleteConsequenceList}
                addButtonTo = {this.addButtonTo}
                renderEditButton = {this.renderEditButton}
                renderAddButton = {this.renderAddButton}
                renderDeleteButton = {this.renderDeleteButton}
              /> : '' }
            </Col>
          </Row>
          <div style={{ maxHeight:720, overflowY:'scroll'}}>
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
          </div>
        </Container>
      </div>
    );
  }
}

const th = { width: 'auto', position: 'sticky', top: 0, color:"white", backgroundColor:"rgba(88,34,34,0.9)" };
const StudentListHeaders = () =>
  <thead>
    <tr>
      <th style={th}>File Number</th>
      <th style={th}>DNI</th>
      <th style={th}>First Name</th>
      <th style={th}>Last Name</th>
      <th style={th}>e-Mail</th>
      <th style={th}>Cell Phone</th>
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

const tr = {whiteSpace: 'nowrap'}
const StudentListItem = props => 
  <tr onClick={props.studentOnClickFunction} id={props.student.fileNumber} style={props.style}> 
    <td style={tr}>{props.student.fileNumber || ''}</td>
    <td style={tr}>{props.student.personalData.dni || ''}</td>
    <td style={tr}>{props.student.personalData.firstName || ''}</td>
    <td style={tr}>{props.student.personalData.lastName || ''}</td>
    <td style={tr}>{props.student.personalData.email || ''}</td>
    <td style={tr}>{props.student.personalData.cellPhone || ''}</td>
  </tr>;

const SearchField = props =>
  <InputGroup>
    <Input type="text" name="searchText" id="searchInput" placeholder="Type to search Students ..."
      value={props.searchText} onChange={props.handleChange}/>
    <InputGroupAddon addonType="append">
      <Button color="secondary" id="searchButton" onClick={props.doSearch}>
        <UncontrolledTooltip target="searchButton">
          Search Students
        </UncontrolledTooltip>
        <FontAwesomeIcon icon="search" size="1x"/>
      </Button>
    </InputGroupAddon>
  </InputGroup>;

FullStudentList.contextType = userContext;
export default FullStudentList;
