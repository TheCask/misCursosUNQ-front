import React from 'react';
import { Container, Table } from 'reactstrap';
import AppSpinner from '../auxiliar/AppSpinner';
import AppNavbar from '../AppNavbar';
import ButtonBar from '../buttons/ButtonBar';
import * as SubjectAPI from '../services/SubjectAPI';
import ComponentWithErrorHandling from '../errorHandling/ComponentWithErrorHandling'
import { userContext } from '../login/UserContext';
import AccessError from '../errorHandling/AccessError';

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
          {this.renderButtonBar ?
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
          <h3>{this.title}</h3>
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
        </Container>
      </div>
    );
  }
}

const SubjectListHeaders = () =>
<thead>
  <tr>
    <th width="5%">Subject Code</th>
    <th width="10%">Subject Name</th>
    <th width="3%">Acronym</th>
    <th width="5%">Subject Program</th>
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

const SubjectListItem = props =>
  <tr onClick={props.subjectOnClickFunction} id={props.subject.code} style={props.style} key={props.subject.code}>
    <td style={{whiteSpace: 'nowrap'}}>{props.subject.code || ''}</td>
    <td style={{whiteSpace: 'nowrap'}}>{props.subject.name || ''}</td>
    <td style={{whiteSpace: 'nowrap'}}>{props.subject.acronym || ''}</td>
    <td style={{whiteSpace: 'nowrap'}}>{props.subject.programURL || ''}</td>
  </tr>;

FullSubjectList.contextType = userContext;
export default FullSubjectList;
