import React from 'react'; //{Component}
import { Container, Table } from 'reactstrap';
import AppSpinner from './AppSpinner';
import AppNavbar from './AppNavbar';
import ButtonBar from './buttonBar/ButtonBar';
import * as SubjectAPI from './services/SubjectAPI';
import ComponentWithErrorHandling from './errorHandling/ComponentWithErrorHandling'


class FullSubjectList extends ComponentWithErrorHandling {
  render() {
    return(
      <AppNavbar>
        {this.renderErrorModal()}
        <SubjectListContainer 
          subjectListTitle = {'Subjects'}
          onGetAll = { (handleSuccess, handleError) => SubjectAPI.getSubjectsAsync(handleSuccess, handleError) }
          onDelete = { (subjectCode, handleSuccess, handleError) => SubjectAPI.deleteSubjectAsync(subjectCode, handleSuccess, handleError)}
          onDeleteConsequenceList = {[
          "The subject will no longer be available.",
          "If the subject has courses associated, deleting is not allowed.",
          "Please change subject from courses before trying to delete."
        ]}
        addButtonTo = {`/subject/new`}
        deleteButtonTo = {'/subjects'}
        />
      </AppNavbar>
    )
  }
}

export class SubjectListContainer extends ComponentWithErrorHandling {

  constructor(props) {
    super(props);
    this.state = {...this.state, ...{subjects: [], isLoading: true, targetId: '', subjectsListTitle: 'Subjects'}}; 
    this.title = this.props.subjectListTitle;
    this.addButtonTo = props.addButtonTo;
    this.deleteButtonTo = props.deleteButtonTo;
    this.contextParams = props;
  }

  componentDidMount() {
    this.setState({isLoading: true});
    this.contextParams.onGetAll(json => this.setState({subjects: json, isLoading: false}, this.showError("get subjects") ));
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

  disallowsDelete(subjectCode) {
    const targetSubject = this.state.subjects.find(subject => subject.code === subjectCode)
    if (targetSubject) {
      return false
    }
    return false
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
        <Container fluid>
          <ButtonBar
            entityType = 'subject'
            targetId={this.state.targetId} 
            deleteEntityFunction={deleteSubjectFunction}
            disallowDelete = {this.disallowsDelete(this.state.targetId)}
            consequenceList = {this.contextParams.onDeleteConsequenceList}
            addButtonTo = {this.addButtonTo}
            deleteButtonTo = {this.deleteButtonTo}
          />
          <h3>{this.title}</h3>
          <Table hover className="mt-4">
            <SubjectListHeaders/>
            <tbody>
              <SubjectList
                subjects = {this.state.subjects}
                subjectOnClickFunction = {(subjectId) =>  {this.setState({targetId: subjectId})}}
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

export default FullSubjectList;
