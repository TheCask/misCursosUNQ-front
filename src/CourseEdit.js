import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Container, Form, FormGroup, Input, Label, ButtonGroup, UncontrolledTooltip, Col } from 'reactstrap';
import AppNavbar from './AppNavbar';
import Log from './Log';
import { StudentListContainer } from './StudentList'
import * as BackAPI from './BackAPI';


class CourseEdit extends Component {

  emptyItem = {
    courseName: '',
    courseCode: '',
    courseShift: '',
    courseIsOpen: true,
    subject: {
      code: ''
    },
    students: [],
    lessons: [],
    teachers: []
  };

  constructor(props) {
    super(props);
    this.state = {
      item: this.emptyItem,
      subjectList: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleIsOpen = this.toggleIsOpen.bind(this);
  }

  async componentDidMount() {
    if (this.props.match.params.id !== 'new') {
      const course = await (await fetch(`/api/course/${this.props.match.params.id}`)).json();
      const subjects = await (await fetch(`/api/subjects/`)).json();
      this.setState({item: course, subjectList: subjects});
    }
  }

  handleChange(event) {
    const {name, value} = event.target;
    const names = name.split(".")
    let item = {...this.state.item};
    if (names[2]) { item[names[0]][names[1]][names[2]] = value }
    else if (names[1]) { item[names[0]][names[1]] = value }
    else { item[name] = value; }
    item['lessons'] = []
    this.setState({item});
  }

  async handleSubmit(event) {
    event.preventDefault();
    const {item} = this.state;
    await fetch('/api/course', {
      method: (item.id) ? 'PUT' : 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item),
    });
    this.props.history.push('/courses');
  }

  renderStudents(){
    return (
      <StudentListContainer 
        studentListTitle = {'Course Students'}
        onGetAll = { (handleSuccess, handleError) => BackAPI.getCourseStudentsAsync(this.state.item.courseCode, handleSuccess, handleError) }
        onDelete = { (studentId, handleSuccess, handleError) => BackAPI.deleteCourseStudentAsync(studentId, this.state.item.courseCode, handleSuccess, handleError)}
        onDeleteConsequenceList = {[
          "The student will no longer be part of this course.", 
          "Student's attendance and grades info will be removed."
        ]}
      />
    );
  }


  render() {
    const {item} = this.state;
    const title = <h2 className="float-left">{item.courseId ? 'Edit Course' : 'Add Course'} </h2>;
    return <div>
      <AppNavbar/>
      <Container fluid>
        <Form onSubmit={this.handleSubmit}>
          {title}
          <FormGroup className="float-right">
          {this.addStudentButton()}{' '}
          <ButtonGroup inline="true">
            <Button size="sm" color="primary" type="submit" id="editCourse">
              <UncontrolledTooltip placement="auto" target="editCourse">
                {item.courseId ? 'Save Changes' : 'Save New Course'}
              </UncontrolledTooltip>
              <FontAwesomeIcon icon={['fas', 'save']} size="2x"/>
            </Button>{' '}
            <Button size="sm" color="secondary" tag={Link} to="/courses" id="backToCourse">
              <UncontrolledTooltip placement="auto" target="backToCourse">
                Discard and Back to Course
              </UncontrolledTooltip>
              <FontAwesomeIcon icon={['fas', 'backward']} size="2x"/>
          </Button>
          </ButtonGroup>
          </FormGroup>
          <FormGroup row>
            <Col sm={3}>
            <Label for="code" hidden>Course Code</Label>
            <Input type="text" name="courseCode" id="code" value={item.courseCode || ''} disabled/>
            </Col>
          </FormGroup>
          <FormGroup>
            <Label for="courseName" hidden>Name</Label>
            <Input type="text" name="courseName" id="name" value={item.courseName || ''} required
                   onChange={this.handleChange} autoComplete="Course Name" placeholder="Name"/>
          </FormGroup>
        
          <FormGroup>
            <Label for="subject" hidden>Subject Code</Label>
            <Input type="select" name="subject.code" id="subject" value={item.subject.code || ''}
                   onChange={this.handleChange} label="Subject Code">
                {this.subjectOptions()}
            </Input>
            <UncontrolledTooltip placement="auto" target="subject">
              Select Subject
            </UncontrolledTooltip>
          </FormGroup>

          <FormGroup>
            <Label for="shift" hidden>Shift</Label>
            <Input type="select" name="courseShift" id="shift" value={item.courseShift || ''}
              onChange={this.handleChange} label="Shift">
                <option>Mañana</option>
                <option>Tarde</option>
                <option>Noche</option>
            </Input>
            <UncontrolledTooltip placement="auto" target="shift">
              Select Shift
            </UncontrolledTooltip>
          </FormGroup>
          <ButtonGroup>
            <Button color="success" id="isOpen" onClick={this.toggleIsOpen} disabled={item.courseIsOpen}>
              <FontAwesomeIcon icon={['fas', 'lock-open']} size="1x" id="lock"/>
            </Button>
            <UncontrolledTooltip placement="auto" target="isOpen">
              Unlock Course
            </UncontrolledTooltip>
            <Button color="danger" id="isClose" onClick={this.toggleIsOpen} disabled={!item.courseIsOpen}>
              <FontAwesomeIcon icon={['fas', 'lock']} size="1x" id="unlock"/>
            </Button>
            <UncontrolledTooltip placement="auto" target="isClose">
              Lock Course
            </UncontrolledTooltip>
          </ButtonGroup>
        </Form>
        {this.renderStudents()}
      </Container>
      
    </div>
  }

  toggleIsOpen() {
    let item = {...this.state.item};
    item["courseIsOpen"] = !item["courseIsOpen"];
    Log.info('Toggle ' + item["courseIsOpen"])
    this.setState({item});
  }

  addStudentButton(){
    const courseId = this.state.item.courseId
    if (courseId) {
      return (
        <Button color="success" tag={Link} to={`/students`} id="addStudentTooltip">
          <UncontrolledTooltip placement="auto" target="addStudentTooltip">
            Add Student
          </UncontrolledTooltip>
          <FontAwesomeIcon icon="user-graduate" size="1x"/>
          <FontAwesomeIcon icon="plus-circle" size="1x" transform="right-5 up-5"/>
        </Button>
      )
    }
  }

  subjectOptions() {
    const subjectList = this.state.subjectList
    return ( subjectList.map(sj => {
      Log.info('Subject Code ' + sj.code)
      return (<option>{sj.code}</option>) 
      })
    )
  }

}

export default withRouter(CourseEdit);