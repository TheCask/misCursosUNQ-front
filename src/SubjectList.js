import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table, UncontrolledTooltip,
  Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AppNavbar from './AppNavbar';
import AppSpinner from './AppSpinner';
import Log from './Log';


class SubjectListContainer extends Component {
  render() {
    return(
    <div>
        <AppNavbar/>
        <SubjectList/>
      </div>
    )
  }
}

export class SubjectList extends Component {

  constructor(props) {
    super(props);
    this.state = {subjects: [], isLoading: true, targetId: '', subjectsListTitle: 'Subjects'}; 
    this.remove = this.remove.bind(this);
    this.toggleRowColor = this.toggleRowColor.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    fetch('/api/subjects/')
      .then(response => response.json())
      .then(data => this.setState({subjects: data, isLoading: false}));
  }

  async remove(id) {
    await fetch(`/api/subject/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updatedSubjects = [...this.state.subjects].filter(subject => subject.code !== id);
      this.setState({subjects: updatedSubjects});
    });
  }

  render() {
    const {subjects, isLoading} = this.state;

    if (isLoading) { return (<AppSpinner></AppSpinner>) }
    const subjectList = subjects.map(subject => {
      const subjectCode = subject.code
      const subjectOnClickFunction = () => {this.setState({targetId: subjectCode})}
      return (
        <SubjectListItem subject = {subject} subjectOnClickFunction={subjectOnClickFunction} style={this.toggleRowColor(subjectCode)} />
      )
    })
    
    const deleteSubjectFunction = () => {this.remove(this.state.targetId)};

    return (
      <div>
        <Container fluid>
          
          <ButtonBar targetId={this.state.targetId} deleteSubjectFunction={deleteSubjectFunction}/>
          
          <h3>{this.state.subjectListTitle}</h3>
          <Table hover className="mt-4">
            <thead>
            <tr>
              <th width="7%">Subject Code</th>
              <th width="10%">Subject Name</th>
              <th width="5%">Acronym</th>
              <th width="5%">Link to Subject Program</th>
            </tr>
            </thead>
            <tbody>
            {subjectList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
  
  toggleRowColor(rowId) {
    if (rowId === this.state.targetId) {
      return {backgroundColor:'#F0F8FF'}
    }
  }
}

export class SubjectListItem extends Component {


  render() {
    const subject = this.props.subject;
    return (
      <tr onClick={this.props.subjectOnClickFunction} id={subject.fileNumber} style={this.props.style}> 
        <td style={{whiteSpace: 'nowrap'}}>{subject.code || ''}</td>
        <td style={{whiteSpace: 'nowrap'}}>{subject.name || ''}</td>
        <td style={{whiteSpace: 'nowrap'}}>{subject.acronym || ''}</td>
        <td style={{whiteSpace: 'nowrap'}}>{subject.programURL || ''}</td>
      </tr>
    )
  }
}  


class ButtonBar extends Component {

  constructor(props) {
    super(props);
    this.state = {modal: false, modalTargetId: ''};
    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal(e) {
    // const courseId = e.target.id.split("_")[1]
    const modal = this.state.modal
    Log.info('modal ' + modal)
    this.setState({modal: !modal});
  }

  render() {
    var targetId = this.props.targetId;
    return (
      <div className="float-right">
        <Button color="success" tag={Link} to="/subject/new" id="addSubjectTooltip">
          <UncontrolledTooltip placement="auto" target="addSubjectTooltip">
                      Add a Subject
          </UncontrolledTooltip>
          <FontAwesomeIcon icon="user-graduate" size="1x"/>
          <FontAwesomeIcon icon="plus-circle" size="1x" transform="right-5 up-5"/>
        </Button>{' '}
        <ButtonGroup inline="true">
          <Button size="sm" color="primary" disabled={targetId === ''} tag={Link} to={"/subject/" + targetId} id={"edit_" + targetId}>
            <UncontrolledTooltip placement="auto" target={"edit_" + targetId}>
                      Edit Selected Subject
            </UncontrolledTooltip>
            <FontAwesomeIcon icon={['fas', 'edit']} size="2x"/>
          </Button>  
          <Button size="sm" color="secondary" disabled={targetId === ''} tag={Link} to={`/subject/${targetId}/details`} id={"detail_" + targetId}>
            <UncontrolledTooltip placement="auto" target={"detail_" + targetId}>
                      Selected Ssubject Details
            </UncontrolledTooltip>         
            <FontAwesomeIcon icon={['fas', 'info-circle']} size="2x"/>
          </Button>
          <Button size="sm" color="danger" disabled={targetId === ''} onClick={() => {this.setState({modalTargetId: targetId}); this.toggleModal()}} id={"delete_" + targetId}>
            <UncontrolledTooltip placement="auto" target={"delete_" + targetId}>
                      Delete Selected Subject
            </UncontrolledTooltip>
            <FontAwesomeIcon icon={['fas', 'trash-alt']} size="2x"/>
          </Button>


          <Modal isOpen={this.state.modal} toggle={this.toggleModal} size="lg">
            <ModalHeader toggle={this.toggleModal}>
              <h3>Are you sure you want to delete selected subject?</h3>
            </ModalHeader>
            <ModalBody>
              <h4> This action will have the following consequences:</h4>
              <ul>
                <li>- This subject will no longer be available</li>
                <br/>
                <li>- All subject courses and their students, as well as all its lessons and their attendance and grade information will be removed!</li>
                <br/>
                <li> If you don't want this subject available anymore, but would like to keep previous courses information, please </li>
              </ul>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" onClick={() => {this.props.deleteSubjectFunction(); this.toggleModal()}} id={"modalDelete"}>
                <UncontrolledTooltip placement="auto" target={"modalDelete"}>
                          YES DELETE SUBJECT (I'm Pretty Sure)
                </UncontrolledTooltip>
                <FontAwesomeIcon icon={['fas', 'trash-alt']} size="2x"/>
              </Button>
              <Button color="secondary" onClick={this.toggleModal} id="modalCancel">
                <UncontrolledTooltip placement="auto" target="modalCancel">
                          Cancel and Back to Subject
                </UncontrolledTooltip>
                <FontAwesomeIcon icon={['fas', 'backward']} size="2x"/>
              </Button>
            </ModalFooter>
          </Modal>
        </ButtonGroup>
      </div>
    )


  }
}

export default SubjectListContainer;
