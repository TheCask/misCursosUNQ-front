import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table, UncontrolledTooltip,
  Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AppNavbar from './AppNavbar';
import AppSpinner from './AppSpinner';
import Log from './Log';


class StudentListContainer extends Component {
  render() {
    return(
    <div>
        <AppNavbar/>
        <StudentList/>
      </div>
    )
  }
}

export class StudentList extends Component {

  constructor(props) {
    super(props);
    this.state = {students: [], isLoading: true, modal: false, modalTargetId: '', targetId: ''};
    this.remove = this.remove.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    fetch('/api/students/')
      .then(response => response.json())
      .then(data => this.setState({students: data, isLoading: false}));
  }

  async remove(id) {
    await fetch(`/api/student/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updatedStudents = [...this.state.students].filter(student => student.fileNumber !== id);
      this.setState({students: updatedStudents});
    });
  }

  render() {
    const {students, isLoading, modal, targetId, modalTargetId} = this.state;
    if (isLoading) { return (<AppSpinner></AppSpinner>) }
    const studentList = students.map(student => {
      const fileNumber = student.fileNumber
      return (
      <tr onClick={() => {this.setState({targetId: fileNumber})}} id={fileNumber}>
        <td style={{whiteSpace: 'nowrap'}}>{fileNumber || ''}</td>
        <td style={{whiteSpace: 'nowrap'}}>{student.personalData.dni || ''}</td>
        <td style={{whiteSpace: 'nowrap'}}>{student.personalData.firstName || ''}</td>
        <td style={{whiteSpace: 'nowrap'}}>{student.personalData.lastName || ''}</td>
        <td style={{whiteSpace: 'nowrap'}}>{student.personalData.email || ''}</td>
        <td style={{whiteSpace: 'nowrap'}}>{student.personalData.cellPhone || ''}</td>
      </tr>)})
      
    return (
      <div>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to="/student/new" id="addStudentTooltip">
              <UncontrolledTooltip placement="auto" target="addStudentTooltip">
                Add a Student
              </UncontrolledTooltip>
              <FontAwesomeIcon icon="user-graduate" size="1x"/>
              <FontAwesomeIcon icon="plus-circle" size="1x" transform="right-5 up-5"/>
            </Button>{' '}
          <ButtonGroup inline="true">
            <Button size="sm" color="primary" disabled={targetId === ''} tag={Link} to={"/student/" + targetId} id={"edit_" + targetId}>
              <UncontrolledTooltip placement="auto" target={"edit_" + targetId}>
                Edit Selected Student
              </UncontrolledTooltip>
              <FontAwesomeIcon icon={['fas', 'edit']} size="2x"/>
            </Button>  
            <Button size="sm" color="secondary" disabled={targetId === ''} tag={Link} to={`/student/${targetId}/details`} id={"detail_" + targetId}>
              <UncontrolledTooltip placement="auto" target={"detail_" + targetId}>
                Selected Student Details
              </UncontrolledTooltip>         
              <FontAwesomeIcon icon={['fas', 'info-circle']} size="2x"/>
            </Button>
            <Button size="sm" color="danger" disabled={targetId === ''} onClick={() => {this.setState({modalTargetId: targetId}); this.toggleModal()}} id={"delete_" + targetId}>
              <UncontrolledTooltip placement="auto" target={"delete_" + targetId}>
                Delete Selected Student
              </UncontrolledTooltip>
              <FontAwesomeIcon icon={['fas', 'trash-alt']} size="2x"/>
            </Button>
            <Modal isOpen={modal} toggle={this.toggleModal} size="lg">
              <ModalHeader toggle={this.toggleModal}><h3>Are you sure you want to delete selected student?</h3></ModalHeader>
              <ModalBody>
                <h4> This action will have the following consequences:</h4>
                <ul>
                  <li>- The student will no longer be alvailable</li>
                  <br></br>
                  <li>- The student will be removed of all taken courses (current and previous)</li>
                  <br></br>
                  <li>- The student will be set unattend on all lessons (current and previous)</li>
                </ul>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onClick={() => {this.remove(modalTargetId); this.toggleModal()}} id={"modalDelete"}>
                  <UncontrolledTooltip placement="auto" target={"modalDelete"}>
                    YES DELETE STUDENT (I'm Pretty Sure)
                  </UncontrolledTooltip>
                  <FontAwesomeIcon icon={['fas', 'trash-alt']} size="2x"/>
                </Button>
                <Button color="secondary" onClick={this.toggleModal} id="modalCancel">
                  <UncontrolledTooltip placement="auto" target="modalCancel">
                    Cancel and Back to Students
                  </UncontrolledTooltip>
                  <FontAwesomeIcon icon={['fas', 'backward']} size="2x"/>
                </Button>
              </ModalFooter>
            </Modal>
          </ButtonGroup>
          </div>
          <h3>Students</h3>
          <Table hover className="mt-4">
            <thead>
            <tr>
              <th width="7%">File Number</th>
              <th width="10%">DNI</th>
              <th width="5%">First Name</th>
              <th width="5%">Last Name</th>
              <th width="2%">eMail</th>
              <th width="2%">Cell Phone</th>
            </tr>
            </thead>
            <tbody>
            {studentList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
  
  toggleModal(e) {
    // const courseId = e.target.id.split("_")[1]
    const modal = this.state.modal
    Log.info('modal ' + modal)
    this.setState({modal: !modal});
  }
}

export default StudentListContainer;
