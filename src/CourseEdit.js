import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Container, Form, FormGroup, Input, ButtonGroup, UncontrolledTooltip, Col } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { StudentListContainer } from './StudentList'
import SaveButton from './buttonBar/SaveButton'
import CancelButton from './buttonBar/CancelButton'
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
      subjectList: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleIsOpen = this.toggleIsOpen.bind(this);
  }

  async componentDidMount() {
    if (this.props.match.params.id !== 'new') {
      BackAPI.getCourseByIdAsync(this.props.match.params.id, course => this.setState({item: course}), null) // TODO: replace null by error showing code
    }
    BackAPI.getSubjectsAsync(json => this.setState({subjectList: json}), null); // TODO: replace null by error showing code
  }

  handleChange(event) {
    const {name, value} = event.target;
    let item = {...this.state.item};
    this.setInnerPropValue(item, name, value);
    item['lessons'] = []
    this.setState({item});
  }

  setInnerPropValue(baseObj, subPropString, value){
    const subProps = subPropString.split(".");
    const lastPropName = subProps.pop(); // elimina del array y retorna el ultimo 
    let propRef = baseObj
    subProps.forEach(subprop => {
      propRef = propRef[subprop];
    });
    propRef[lastPropName] = value;
  }

  async handleSubmit(event) {
    event.preventDefault();
    const {item} = this.state;
    BackAPI.postCourseAsync(item, () => this.props.history.push('/courses'), null); // TODO: replace null by error showing code
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
          <ButtonGroup>
            <SaveButton entityId = {item.courseId} entityTypeCapName = "Course" />
            <CancelButton to = {"/courses"} entityTypeCapName = "Course" />
          </ButtonGroup>
          </FormGroup>
          <FormGroup row>
            <Col sm={3}>
              <Input type="text" name="courseCode" id="code" value={item.courseCode || ''} disabled/>
            </Col>
          </FormGroup>
          <FormGroup>
            <Input type="text" name="courseName" id="name" value={item.courseName || ''} required
                   onChange={this.handleChange} autoComplete="Course Name" placeholder="Name"/>
          </FormGroup>
          <FormGroup>
            <Input type="select" name="subject.code" id="subject" value={item.subject.code || ''}
                   onChange={this.handleChange} label="Subject Code" required>
              {this.subjectOptions()}
            </Input>
            <UncontrolledTooltip placement="auto" target="subject"> Select Subject </UncontrolledTooltip>
          </FormGroup>
          <FormGroup>
            <Input type="select" name="courseShift" id="shift" value={item.courseShift || ''}
              onChange={this.handleChange} label="Shift" required>
                <option>Mañana</option>
                <option>Tarde</option>
                <option>Noche</option>
            </Input>
            <UncontrolledTooltip placement="auto" target="shift"> Select Shift </UncontrolledTooltip>
          </FormGroup>
          <ButtonGroup size="sm">
            <Button color="success" id="isOpen" onClick={this.toggleIsOpen} disabled={item.courseIsOpen}>
              <FontAwesomeIcon icon='lock-open' size="1x" id="lock"/>
            </Button>
            <UncontrolledTooltip placement="auto" target="isOpen"> Unlock Course </UncontrolledTooltip>
            <Button color="danger" id="isClose" onClick={this.toggleIsOpen} disabled={!item.courseIsOpen}>
              <FontAwesomeIcon icon='lock' size="1x" id="unlock"/>
            </Button>
            <UncontrolledTooltip placement="auto" target="isClose"> Lock Course </UncontrolledTooltip>
          </ButtonGroup>
        </Form>
        {this.renderStudents()}
      </Container>
    </div>
  }

  renderStudents() {
    const courseId = this.props.match.params.id;
    if (courseId !== 'new') {
      return (
        <StudentListContainer 
          studentListTitle = {'Course Students'}
          onGetAll = { (handleSuccess, handleError) => BackAPI.getCourseStudentsAsync(courseId, handleSuccess, handleError) }
          onDelete = { (studentId, handleSuccess, handleError) => BackAPI.deleteCourseStudentAsync(studentId, courseId, handleSuccess, handleError)}
          onDeleteConsequenceList = {[
            "The student will no longer be part of this course.", 
            "Student's attendance and grades info will be removed."
          ]}
          addButtonTo = {`/course/${courseId}/addStudents`}
        />
      );
    }
  }


  toggleIsOpen() {
    let item = {...this.state.item};
    item["courseIsOpen"] = !item["courseIsOpen"];
    this.setState({item});
  }

  subjectOptions() {
    const subjectList = this.state.subjectList
    return ( subjectList.map(sj => {
      return (<option key={sj.code}>{sj.code}</option>) 
    })
    )
  }
}

export default withRouter(CourseEdit);