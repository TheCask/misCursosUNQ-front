import React from 'react';
import { Container, Table, Col, Row } from 'reactstrap';
import { userContext } from '../login/UserContext';
import AppSpinner from '../auxiliar/AppSpinner';
import AppNavbar from '../AppNavbar';
import ButtonBar from '../buttons/ButtonBar';
import ComponentWithErrorHandling from '../errorHandling/ComponentWithErrorHandling'
import AccessError from '../errorHandling/AccessError';
import * as SubjectAPI from '../services/SubjectAPI';
import * as Constants from '../auxiliar/Constants'

class FullSubjectList extends ComponentWithErrorHandling {
  render() {
    this.actualRol = this.context.actualRol;
    return (this.actualRol !== 'Cycle Coordinator' ?
      <AccessError errorCode="Only Coordinators are allowed" 
          errorDetail="Make sure you are signed in with valid role before try to access this page"/>
      :
      <AppNavbar>
        {this.renderErrorModal()}
        <SubjectListContainer 
          subjectListTitle = {'Subjects'}
          onGetAll = { (handleSuccess, handleError) => SubjectAPI.getSubjectsAsync(handleSuccess, handleError) }
          onDelete = { (subjectCode, handleSuccess, handleError) => SubjectAPI.deleteSubjectAsync(subjectCode, handleSuccess, handleError)}
          onDeleteConsequenceList = {[
          "The subject will no longer be available."
          ]}
          addButtonTo = {`/subject/new`}
          renderButtonBar = {this.context.actualRol === 'Cycle Coordinator'}
          renderEditButton = {true}
          renderAddButton = {true}
          renderDeleteButton = {true}
          deleteButtonTo = {'/subjects'}
        />
      </AppNavbar>
    )
  }
}

export class SubjectListContainer extends ComponentWithErrorHandling {

  constructor(props) {
    super(props);
    this.state = {...this.state, subjects: [], isLoading: true, targetId: '', subjectsListTitle: 'Subjects', couseQty: undefined}; 
    this.title = this.props.subjectListTitle;
    this.addButtonTo = props.addButtonTo;
    this.renderButtonBar = props.renderButtonBar;
    this.renderEditButton = props.renderEditButton;
    this.renderAddButton = props.renderAddButton;
    this.renderDeleteButton = props.renderDeleteButton;
    this.deleteButtonTo = props.deleteButtonTo;
    this.contextParams = props;
  }

  componentDidMount() {
    this.setState({isLoading: true});
    this.contextParams.onGetAll(json => this.setState({subjects: json, isLoading: false}), 
      this.showError("get subjects"));
  }

  remove(subjectId) {
    this.contextParams.onDelete(
      subjectId, 
      () => {
        let updatedSubjects = [...this.state.subjects].filter(subject => subject.code !== subjectId);
        this.setState({subjects: updatedSubjects, targetId: ''});
      },
      this.showError("remove subject")
    );
  }

  getCourseQty(subjectCode){
    SubjectAPI.getSubjectCourseQtyAsync(subjectCode, 
      qty => this.setState( {couseQty: parseInt(qty)} ), 
      this.showError("get subject course quantity")
    )
  }

  disallowsDelete(subjectCode) {
    return true == this.state.couseQty;
  }

  setSelectedRowColor(rowId) {
    if (rowId === this.state.targetId) {
      return {backgroundColor:'#F0F8FF'}
    }
  }

  render() {
    const {isLoading} = this.state;
    if (isLoading) { return (<AppSpinner/>) }
    const deleteSubjectFunction = () => {this.remove(this.state.targetId)};
    return (
      <div>
        {this.renderErrorModal()}
        <Container fluid>
          <Row xs="2">
            <Col> <h3>{this.title}</h3> </Col>
            <Col>
              { this.renderButtonBar ?
              <ButtonBar
                entityType = 'subject'
                targetId={this.state.targetId} 
                deleteEntityFunction={deleteSubjectFunction}
                disallowDelete = {this.disallowsDelete(this.state.targetId)}
                consequenceList = {this.contextParams.onDeleteConsequenceList}
                addButtonTo = {this.addButtonTo}
                renderEditButton = {this.renderEditButton}
                renderAddButton = {this.renderAddButton}
                renderDeleteButton = {this.renderDeleteButton}
                deleteButtonTo = {this.deleteButtonTo}
                onDisableDeleteTitle={"This subject can't be deleted"}
                onDisableDeleteBody={
                  <div>
                    <h3>The subject has course instances.</h3>
                    <p>Please remove subject courses before trying to delete subject.</p>
                  </div>
                }
              /> : ''}
            </Col>
          </Row>
          <div style={{ maxHeight:720, overflowY:'scroll'}}>
          <Table hover className="mt-4">
            <SubjectListHeaders/>
            <tbody>
              <SubjectList
                subjects = {this.state.subjects}
                subjectOnClickFunction = {(subjectId) =>  {this.setState({targetId: subjectId}); this.getCourseQty(subjectId)}}
                styleFunction = {(subjectId) => this.setSelectedRowColor(subjectId)}
              />
            </tbody>
          </Table>
          </div>
        </Container>
      </div>
    );
  }
}

const th = Constants.tableHeader
const SubjectListHeaders = () =>
<thead>
  <tr>
    <th style={th}>Subject Code</th>
    <th style={th}>Subject Name</th>
    <th style={th}>Acronym</th>
    <th style={th}>Subject Program</th>
  </tr>
</thead>;

const SubjectList = props => {
  return props.subjects.map((subject, index) => {
    const subjectOnClickFunction = () => props.subjectOnClickFunction(subject.code);
    return (
      <SubjectListItem 
        key = {index}
        subject = {subject} 
        subjectOnClickFunction = {subjectOnClickFunction} 
        style = {props.styleFunction(subject.code)} 
      />
    )
  });
}

const tr = Constants.tableRow
const SubjectListItem = props =>
  <tr onClick={props.subjectOnClickFunction} id={props.subject.code} style={props.style} key={props.subject.code}>
    <td style={tr}>{props.subject.code || ''}</td>
    <td style={tr}>{props.subject.name || ''}</td>
    <td style={tr}>{props.subject.acronym || ''}</td>
    <td style={tr}>{props.subject.programURL || ''}</td>
  </tr>;

FullSubjectList.contextType = userContext;
export default FullSubjectList;
