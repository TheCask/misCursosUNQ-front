import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table, UncontrolledTooltip,
  Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AppNavbar from './AppNavbar';
import AppSpinner from './AppSpinner';
import Log from './Log';

class CourseList extends Component {

  constructor(props) {
    super(props);
    this.state = {courses: [], isLoading: true, modal: false, modalTargetId: '', targetId: ''};
    this.remove = this.remove.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.toggleRowColor = this.toggleRowColor.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    fetch('/api/courses')
      .then(response => response.json())
      .then(data => this.setState({courses: data, isLoading: false}));
  }

  async remove(id) {
    await fetch(`/api/course/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updatedCourses = [...this.state.courses].filter(i => i.courseId !== id);
      this.setState({courses: updatedCourses});
    });
  }

  render() {
    const {courses, isLoading, modal, targetId, modalTargetId} = this.state;
    if (isLoading) { return (<AppSpinner></AppSpinner>) }
    const courseList = courses.map(course => {
      const courseId = course.courseId
      return (
      <tr onClick={() => {this.setState({targetId: courseId})}} id={courseId} style={this.toggleRowColor(courseId)}>
        <td style={{textAlign: 'center'}}> {this.getIcon(course.courseName, courseId)}</td>
        <td style={{whiteSpace: 'nowrap'}}>{course.courseName || ''}</td>
        <td style={{whiteSpace: 'nowrap'}}>{course.courseCode || ''}</td>
        <td style={{whiteSpace: 'nowrap'}}>{course.courseShift || ''}</td>
        <td style={{whiteSpace: 'nowrap'}}>{this.formatYESoNO(course.courseIsOpen) || ''}</td>
        <td style={{whiteSpace: 'nowrap'}}>{course.students.length || ''}</td>
        <td style={{whiteSpace: 'nowrap'}}>{course.lessons.length || ''}</td>
        <td>
          <Button size="sm" color="success" outline block tag={Link} to={`/course/${courseId}/lessons`} id={"attendance_" + courseId}>
            <UncontrolledTooltip placement="auto" target={"attendance_" + courseId}>
              Take Attendance
            </UncontrolledTooltip>         
            <FontAwesomeIcon icon={['fas', 'tasks']} size="1x"/>
          </Button>
        </td>
      </tr>)})
      
    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to="/course/new" id="addCourseTooltip">
              <UncontrolledTooltip placement="auto" target="addCourseTooltip">
                Add a course
              </UncontrolledTooltip>
              <FontAwesomeIcon icon="chalkboard-teacher" size="1x"/>
              <FontAwesomeIcon icon="plus-circle" size="1x" transform="right-5 up-5"/>
            </Button>{' '}
          <ButtonGroup inline="true">
            <Button size="sm" color="primary" disabled={targetId === ''} tag={Link} to={"/course/" + targetId} id={"edit_" + targetId}>
              <UncontrolledTooltip placement="auto" target={"edit_" + targetId}>
                Edit Selected Course
              </UncontrolledTooltip>
              <FontAwesomeIcon icon={['fas', 'edit']} size="2x"/>
            </Button>
            <Button size="sm" color="danger" disabled={targetId === ''} onClick={() => {this.setState({modalTargetId: targetId}); this.toggleModal()}} id={"delete_" + targetId}>
              <UncontrolledTooltip placement="auto" target={"delete_" + targetId}>
                Delete Selected Course
              </UncontrolledTooltip>
              <FontAwesomeIcon icon={['fas', 'trash-alt']} size="2x"/>
            </Button>
            <Modal isOpen={modal} toggle={this.toggleModal} size="lg">
              <ModalHeader toggle={this.toggleModal}><h3>Are you sure you want to delete entire course?</h3></ModalHeader>
              <ModalBody>
                <h4> This action will have the following consequences:</h4>
                <ul>
                  <li>- The course will no longer be alvailable
                  <br></br>
                  (Students will exit the course)</li>
                  <br></br>
                  <li>- Course lessons will no longer be alvailable
                  <br></br>
                  (Students will lost their attendance to this course)</li>
                </ul>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onClick={() => {this.remove(modalTargetId); this.toggleModal()}} id={"modalDelete"}>
                  <UncontrolledTooltip placement="auto" target={"modalDelete"}>
                    YES DELETE COURSE (I'm Pretty Sure)
                  </UncontrolledTooltip>
                  <FontAwesomeIcon icon={['fas', 'trash-alt']} size="2x"/>
                </Button>
                <Button color="secondary" onClick={this.toggleModal} id="modalCancel">
                  <UncontrolledTooltip placement="auto" target="modalCancel">
                    Cancel and Back to Course
                  </UncontrolledTooltip>
                  <FontAwesomeIcon icon={['fas', 'backward']} size="2x"/>
                </Button>
              </ModalFooter>
            </Modal>
          </ButtonGroup>
          </div>
          <h3>Courses</h3>
          <Table hover className="mt-4">
            <thead>
            <tr>
              <th width="4%"></th>
              <th width="7%">Name</th>
              <th width="10%">Code</th>
              <th width="5%">Shift</th>
              <th width="5%">Open</th>
              <th width="2%">Students</th>
              <th width="2%">Lessons</th>
              <th width="3%">Attendance</th>
            </tr>
            </thead>
            <tbody>
            {courseList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }

  formatYESoNO(value) {
    return value===false ? 'No' : 'Yes';
  }
  
  toggleModal(e) {
    // const courseId = e.target.id.split("_")[1]
    const modal = this.state.modal
    Log.info('modal ' + modal)
    this.setState({modal: !modal});
  }

  toggleRowColor(rowId) {
    if (rowId === this.state.targetId) {
      return {backgroundColor:'#F0F8FF'}
    }
  }

  getIcon(courseName, courseSelectedId) {
    if (courseSelectedId === this.state.targetId) {
      switch(courseName.split("-")[0]) {
        case "LEA":
          return (
            <span className="fa-layers fa-fw">
              <FontAwesomeIcon icon='check' size="1x" color="green" transform="left-10 up-10"/>
              <FontAwesomeIcon icon='book' size="1x" color="darkred" transform="right-10 up-10"/>
              <FontAwesomeIcon icon='pencil-alt' size="1x" color="darkred" transform="left-10 down-10"/>
              <FontAwesomeIcon icon='graduation-cap' size="1x" color="darkred" transform="right-10 down-10"/>
            </span>)
        case "EPYL":
          return (
            <span className="fa-layers fa-fw">
              <FontAwesomeIcon icon='check' size="1x" color="green" transform="left-10 up-10"/>
              <FontAwesomeIcon icon='microchip' size="1x" color="black" transform="right-10 up-10"/>
              <FontAwesomeIcon icon='laptop-code' size="1x" color="black" transform="left-10 down-10"/>
              <FontAwesomeIcon icon='brain' size="1x" color="black" transform="right-10 down-10"/>
            </span>)
        case "MATE":
          return (
            <span className="fa-layers fa-fw">
              <FontAwesomeIcon icon='check' size="1x" color="green" transform="left-10 up-10"/>
              <FontAwesomeIcon icon='shapes' size="1x" color="darkblue" transform="right-10 up-10"/>
              <FontAwesomeIcon icon='infinity' size="1x" color="darkblue" transform="left-10 down-10"/>
              <FontAwesomeIcon icon='calculator' size="1x" color="darkblue" transform="right-10 down-10"/>
            </span>)
        case "ICFYQ":
          return (
            <span className="fa-layers fa-fw">
              <FontAwesomeIcon icon='check' size="1x" color="green" transform="left-10 up-10"/>
              <FontAwesomeIcon icon='atom' size="1x" color="darkgreen" transform="right-10 up-10"/>
              <FontAwesomeIcon icon='flask' size="1x" color="darkgreen" transform="left-10 down-10"/>
              <FontAwesomeIcon icon='magnet' size="1x" color="darkgreen" transform="right-10 down-10"/>
            </span>)
        default:
          return <FontAwesomeIcon icon={['fas', 'chalkboard']} size="2x" color="gray"/>
      }  
    }
    else { return '' }
  }
}

export default CourseList;