import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Container, Form, FormGroup, Input, Label, ButtonGroup, UncontrolledTooltip } from 'reactstrap';
import AppNavbar from './AppNavbar';
import Log from './Log';
import { StudentList } from './StudentList'

class CourseEdit extends Component {

  emptyItem = {
    courseName: '',
    courseCode: '',
    courseShift: 'Mañana',
    courseIsOpen: true,
    courseStudents: null,
    courseLessons: null
  };

  constructor(props) {
    super(props);
    this.state = {
      item: this.emptyItem,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleIsOpen = this.toggleIsOpen.bind(this);
  }

  async componentDidMount() {
    if (this.props.match.params.id !== 'new') {
      const course = await (await fetch(`/api/course/${this.props.match.params.id}`)).json();
      this.setState({item: course});
    }
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    let item = {...this.state.item};
    item[name] = value;
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

  render() {
    const {item} = this.state;
    const title = <h2 className="float-left">{item.courseId ? 'Edit Course' : 'Add Course'}</h2>;
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
          <FormGroup>
            <Label for="courseName" hidden>Name</Label>
            <Input type="text" name="courseName" id="name" value={item.courseName || ''}
                   onChange={this.handleChange} autoComplete="Course Name" placeholder="Name"/>
          </FormGroup>
          <FormGroup>
            <Label for="code" hidden>Code</Label>
            <Input type="text" name="courseCode" id="code" value={item.courseCode || ''}
                   onChange={this.handleChange} autoComplete="Course Code" placeholder="Code"/>
          </FormGroup>
          <FormGroup>
            <Label for="shift" hidden>Shift</Label>
            <Input type="select" name="courseShift" id="shift" value={item.courseShift || ''}
              onChange={this.handleChange} autoComplete="Course Shift" label="Shift">
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
        <StudentList/>
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
    if (this.state.item.courseId) {
      return (
        <Button color="success" tag={Link} to="/course/new" id="addStudentTooltip">
          <UncontrolledTooltip placement="auto" target="addStudentTooltip">
            Add Student
          </UncontrolledTooltip>
          <FontAwesomeIcon icon="user-graduate" size="1x"/>
          <FontAwesomeIcon icon="plus-circle" size="1x" transform="right-5 up-5"/>
        </Button>
      )
    }
  }

}

export default withRouter(CourseEdit);