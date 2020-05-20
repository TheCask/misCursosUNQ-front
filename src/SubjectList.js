import React, { Component } from 'react';
import { Container, Table } from 'reactstrap';
import AppSpinner from './AppSpinner';
import AppNavbar from './AppNavbar';
import ButtonBar from './buttonBar/ButtonBar';
import * as BackAPI from './BackAPI';

class FullSubjectList extends Component {
  render() {
    return(
    <div>
        <AppNavbar/>
        <SubjectListContainer 
          subjectListTitle = {'Subjects'}
          onGetAll = { (handleSuccess, handleError) => BackAPI.getSubjectsAsync(handleSuccess, handleError) }
          onDelete = { (subjectCode, handleSuccess, handleError) => BackAPI.deleteSubjectAsync(subjectCode, handleSuccess, handleError)}
          onDeleteConsequenceList = {[
          "The subject will no longer be available.",
          "If the subject has courses associated, deleting is not allowed.",
          "Please change subject from courses before trying to delete."
        ]}
        />
      </div>
    )
  }
}

export class SubjectListContainer extends Component {

  constructor(props) {
    super(props);
    this.title = this.props.subjectListTitle;
    this.state = {subjects: [], isLoading: true, targetId: '', subjectsListTitle: 'Subjects'}; 
    this.contextParams = props;
  }

  componentDidMount() {
    this.setState({isLoading: true});
    this.contextParams.onGetAll(json => this.setState({subjects: json, isLoading: false}, null )); // TODO: replace null by error showing code
  }

  remove(subjectId) {
    this.contextParams.onDelete(
      subjectId, 
      () => {
        let updatedSubjects = [...this.state.subjects].filter(subject => subject.code !== subjectId);
        this.setState({subjects: updatedSubjects, targetId: ''});
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
            consequenceList = {this.contextParams.onDeleteConsequenceList} />
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
    <td style={{whiteSpace: 'nowrap'}}>{props.subject.acranym || ''}</td>
    <td style={{whiteSpace: 'nowrap'}}>{props.subject.programURL || ''}</td>
  </tr>;


// export class SubjectListItem extends Component {
//   render() {
//     const subject = this.props.subject;
//     return (
//       <tr onClick={this.props.subjectOnClickFunction} id={subject.fileNumber} style={this.props.style}> 
//         <td style={{whiteSpace: 'nowrap'}}>{subject.code || ''}</td>
//         <td style={{whiteSpace: 'nowrap'}}>{subject.name || ''}</td>
//         <td style={{whiteSpace: 'nowrap'}}>{subject.acronym || ''}</td>
//         <td style={{whiteSpace: 'nowrap'}}>{subject.programURL || ''}</td>
//       </tr>
//     )
//   }
// }  


// class ButtonBar extends Component {

//   constructor(props) {
//     super(props);
//     this.state = {modal: false, modalTargetId: ''};
//     this.toggleModal = this.toggleModal.bind(this);
//   }

//   toggleModal(e) {
//     // const courseId = e.target.id.split("_")[1]
//     const modal = this.state.modal
//     this.setState({modal: !modal});
//   }

//   render() {
//     var targetId = this.props.targetId;
//     return (
//       <div className="float-right">
//         <Button color="success" tag={Link} to="/subject/new" id="addSubjectTooltip">
//           <UncontrolledTooltip placement="auto" target="addSubjectTooltip">
//                       Add a Subject
//           </UncontrolledTooltip>
//           <FontAwesomeIcon icon="university" size="1x"/>
//           <FontAwesomeIcon icon="plus-circle" size="1x" transform="right-5 up-5"/>
//         </Button>{' '}
//         <ButtonGroup inline="true">
//           <Button size="sm" color="primary" disabled={targetId === ''} tag={Link} to={"/subject/" + targetId} id={"edit_" + targetId}>
//             <UncontrolledTooltip placement="auto" target={"edit_" + targetId}>
//                       Edit Selected Subject
//             </UncontrolledTooltip>
//             <FontAwesomeIcon icon={['fas', 'edit']} size="2x"/>
//           </Button>  
//           <Button size="sm" color="secondary" disabled={targetId === ''} tag={Link} to={`/subject/${targetId}/details`} id={"detail_" + targetId}>
//             <UncontrolledTooltip placement="auto" target={"detail_" + targetId}>
//                       Selected Subject Details
//             </UncontrolledTooltip>         
//             <FontAwesomeIcon icon={['fas', 'info-circle']} size="2x"/>
//           </Button>
//           <Button size="sm" color="danger" disabled={targetId === ''} onClick={() => {this.setState({modalTargetId: targetId}); this.toggleModal()}} id={"delete_" + targetId}>
//             <UncontrolledTooltip placement="auto" target={"delete_" + targetId}>
//                       Delete Selected Subject
//             </UncontrolledTooltip>
//             <FontAwesomeIcon icon={['fas', 'trash-alt']} size="2x"/>
//           </Button>


//           <Modal isOpen={this.state.modal} toggle={this.toggleModal} size="lg">
//             <ModalHeader toggle={this.toggleModal}>
//               <h3>Are you sure you want to delete selected subject?</h3>
//             </ModalHeader>
//             <ModalBody>
//               <h4> This action will have the following consequences:</h4>
//               <ul>
//                 <li>- This subject will no longer be available</li>
//                 <br/>
//                 <li>- All subject courses and their students, as well as all its lessons and their attendance and grade information will be removed!</li>
//                 <br/>
//                 <li> If you don't want this subject available anymore, but would like to keep previous courses information, please </li>
//               </ul>
//             </ModalBody>
//             <ModalFooter>
//               <Button color="danger" onClick={() => {this.props.deleteSubjectFunction(); this.toggleModal()}} id={"modalDelete"}>
//                 <UncontrolledTooltip placement="auto" target={"modalDelete"}>
//                           YES DELETE SUBJECT (I'm Pretty Sure)
//                 </UncontrolledTooltip>
//                 <FontAwesomeIcon icon={['fas', 'trash-alt']} size="2x"/>
//               </Button>
//               <Button color="secondary" onClick={this.toggleModal} id="modalCancel">
//                 <UncontrolledTooltip placement="auto" target="modalCancel">
//                           Cancel and Back to Subject
//                 </UncontrolledTooltip>
//                 <FontAwesomeIcon icon={['fas', 'backward']} size="2x"/>
//               </Button>
//             </ModalFooter>
//           </Modal>
//         </ButtonGroup>
//       </div>
//     )


//   }
// }

export default FullSubjectList;
