import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table, Spinner, 
  UncontrolledTooltip, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AppNavbar from './AppNavbar';
import Log from './Log';

class CourseList extends Component {

  constructor(props) {
    super(props);
    this.state = {courses: [], isLoading: true, modal: false};
    this.remove = this.remove.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
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
    const {courses, isLoading, modal} = this.state;
    if (isLoading) {
      return <div><Spinner style={{ width: '2rem', height: '2rem', marginLeft: '50%', marginTop: '50%'  }} color="danger" /> </div>
    }
    const courseList = courses.map(course => {
      return <tr key={course.courseId}>
        <td style={{whiteSpace: 'nowrap'}}>{course.courseName || ''}</td>
        <td style={{whiteSpace: 'nowrap'}}>{course.courseCode || ''}</td>
        <td style={{whiteSpace: 'nowrap'}}>{course.courseShift || ''}</td>
        <td style={{whiteSpace: 'nowrap'}}>{this.formatYESoNO(course.courseIsOpen) || ''}</td>
        <td style={{whiteSpace: 'nowrap'}}>{course.students.length || ''}</td>
        <td style={{whiteSpace: 'nowrap'}}>{course.lessons.length || ''}</td>
        <td>
          <ButtonGroup inline="true">
            <Button size="sm" color="primary" tag={Link} to={"/course/" + course.courseId} id="editCourse">
              <UncontrolledTooltip placement="auto" target="editCourse">
                Edit Course
              </UncontrolledTooltip>
              <FontAwesomeIcon icon={['fas', 'edit']} size="1x"/>
            </Button>
            <Button size="sm" color="danger" onClick={this.toggleModal} id="deleteCourse">
              <UncontrolledTooltip placement="auto" target="deleteCourse">
                Delete Course
              </UncontrolledTooltip>
              <FontAwesomeIcon icon={['fas', 'minus-circle']} size="1x"/>
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
                <Button color="danger" onClick={() => {this.remove(course.courseId); this.toggleModal()}} id="modalDeleteCourse">
                  <UncontrolledTooltip placement="auto" target="modalDeleteCourse">
                    YES DELETE COURSE (I'm Pretty Sure)
                  </UncontrolledTooltip>
                  <FontAwesomeIcon icon={['fas', 'minus-circle']} size="2x"/>
                </Button>
                <Button color="secondary" onClick={this.toggleModal} id="modalCancel">
                  <UncontrolledTooltip placement="auto" target="modalCancel">
                    Cancel and Back to Course
                  </UncontrolledTooltip>
                  <FontAwesomeIcon icon={['fas', 'backward']} size="2x"/>
                </Button>
              </ModalFooter>
            </Modal>

            <Button size="sm" color="success" tag={Link} to={`/course/${course.courseId}/lessons`} id="attendanceCourse">
              <UncontrolledTooltip placement="auto" target="attendanceCourse">
                Take Attendance
              </UncontrolledTooltip>
              <FontAwesomeIcon icon={['fas', 'user-check']} size="1x"/>
            </Button>
          </ButtonGroup>
        </td>
      </tr>
    });

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to="/course/new" id="addCourseTooltip">
              <UncontrolledTooltip placement="auto" target="addCourseTooltip">
                Add a course
              </UncontrolledTooltip>
              <FontAwesomeIcon icon={['fas', 'plus-circle']} size="2x"/>
            </Button>
          </div>
          <h3>Courses</h3>
          <Table className="mt-4">
            <thead>
            <tr>
              <th width="10%">Name</th>
              <th width="15%">Code</th>
              <th width="5%">Shift</th>
              <th width="5%">Open</th>
              <th width="1%">Students</th>
              <th width="1%">Lessons</th>
              <th width="5%">Actions</th>
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
    const modal = this.state.modal
    this.setState({modal: !modal});
  } 

}

export default CourseList;