import React from 'react';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Container, Form, FormGroup, Input, ButtonGroup, UncontrolledTooltip, 
  Col, Row, Label } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { StudentListContainer } from './StudentList'
import { UserListContainer } from './UserList'
import SaveButton from './buttonBar/SaveButton'
import CancelButton from './buttonBar/CancelButton'
import * as CourseAPI from './services/CourseAPI';
import * as SubjectAPI from './services/SubjectAPI';
import ComponentWithErrorHandling from './errorHandling/ComponentWithErrorHandling'
import Collapsable from './Collapsable';
import AppSpinner from './AppSpinner';
import { userContext } from './login/UserContext';

class CourseEdit extends ComponentWithErrorHandling {

  SeasonOptions = ['1C', '2C', '3C', '1T', '2T', '3T', '4T', '1S', '2S']
  ShiftOptions = ['Mañana', 'Tarde', 'Noche']

  emptyItem = {
    courseCode: '',
    courseShift: '',
    courseIsOpen: true,
    courseYear: 2020,
    courseSeason: '',
    courseLocation: '',
    subject: {
      code: '',
      name: ''
    },
    students: [],
    lessons: [],
    teachers: [],
    evaluations: []
  };

  constructor(props) {
    super(props);
    this.state = {...this.state, ...{
      item: this.emptyItem,
      subjectList: [], isLoading: true, 
      alert: {on: false, color: '', message: ''}
    }};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleIsOpen = this.toggleIsOpen.bind(this);
    this.onlyDetail = props.onlyDetail || false;
  }

  async componentDidMount() {
    if (this.props.match.params.id !== 'new') {
      CourseAPI.getCourseByIdAsync(this.props.match.params.id, 
        course => this.setState({item: course}), 
        this.showError("get course"));
    }
    SubjectAPI.getSubjectsAsync(json => { 
      this.setState({subjectList: json}); 
      this.setDefaultSeason();
      this.setDefaultShift();
      this.setDefaultSubjectName();
      }, 
      this.showError("get subjects"))
      .then(this.setState({isLoading: false}));
  }

  handleChange(event) {
    const {name, value} = event.target;
    let item = {...this.state.item};
    // to save the code of the selected name subject
    if (name === 'subject.code') {
      let code = this.subjectName2Code(value)
      this.setInnerPropValue(item, name, code);
      this.setInnerPropValue(item, 'subject.name', value);
    }
    else { item[name] = value}
    item['lessons'] = []
    this.setState({item});
  }

  subjectName2Code(subjectName) {
    let subject = this.state.subjectList.find(sb => sb.name === subjectName)
    return subject.code
  }

  setInnerPropValue(baseObj, subPropString, value){
    const subProps = subPropString.split(".");
    const lastPropName = subProps.pop(); // elimina del array y retorna el ultimo 
    let propRef = baseObj;
    subProps.forEach(subprop => {
      propRef = propRef[subprop];
    });
    propRef[lastPropName] = value;
  }

  async handleSubmit(event) {
    event.preventDefault();
    const {item} = this.state;
    CourseAPI.postCourseAsync(item, 
      () => { this.showSuccess('200', 'The Course has been saved!'); }, 
      this.showError("save course. Check if the course already exists based on code, subject, year and season"));
  }

  getFullCode(courseCode, subjectCode) {
    let fullCode = 'Full Code';
    if (courseCode && subjectCode) {
      const split = subjectCode.split('-');
      fullCode = `${split[0]}-${courseCode}-${split[1]}`; 
    }
    return fullCode;
  }

  showSuccess = (errorCode, errorText) => {
    this.setState({
        isErrorModalOpen: true,
        lastError: {
            title: "Alright, everything worked...", 
            shortDesc: "Successfully saved Course" ,
            httpCode: errorCode,
            errorText: errorText
        }
    })
  }

  chooseTitle(onlyDetail) {
    let title = ''
    if (onlyDetail) { title = 'Course Details' }
    else if (this.props.match.params.id === 'new') { title = 'Add Course'}
    else { title = 'Edit Course'}
    return <h2 className="float-left">{title}</h2>;
  }

  render() {
    const {item, isLoading} = this.state;
    if (isLoading) { return <AppSpinner/> }
    let onlyDetail = this.onlyDetail;
    let title = this.chooseTitle(onlyDetail);
    let actualRol = this.context.actualRol;
    return <div>
      <AppNavbar>
      {this.renderErrorModal()}
        <Container fluid>
        <Form onSubmit={this.handleSubmit}>
          <Row xs="2">
            <Col>{title}</Col>
            <Col>
            <ButtonGroup className="float-right">
              <SaveButton entityId = {item.courseId} entityTypeCapName = "Course" disabled={onlyDetail || actualRol !== 'Cycle Coordinator'}/>
              <CancelButton onClick={() => this.props.history.goBack()} />
            </ButtonGroup>
            </Col>
          </Row>
          <Row form>
            <Col xs="4">
              <FormGroup>
                <Label for="fullCode">Full Code</Label>
                <Input type="text" name="courseFullCode" id="fullCode" disabled
                  value={this.getFullCode(item.courseCode, item.subject.code) || ''}/>
              </FormGroup>
            </Col>
            <Col xs="2">
              <FormGroup>
                <Label for="code">Code</Label>
                <Input type="text" maxLength="5" name="courseCode" id="code" value={item.courseCode} required
                  onChange={this.handleChange} autoComplete="Course Code" placeholder="Code" disabled={onlyDetail}/>
              </FormGroup>
            </Col>
            <Col xs="6">
              <FormGroup>
                <Label for="subject">Subject</Label>
                <Input type="select" name="subject.code" id="subject"  value={item.subject.name || ''}
                      onChange={this.handleChange} required disabled={onlyDetail}>
                  {this.subjectOptions()}
                </Input>
                <UncontrolledTooltip placement="auto" target="subject"> Select Subject </UncontrolledTooltip>
              </FormGroup>
            </Col>
          </Row>
          <Row form>
            <Col xs="2">
              <FormGroup>
                <Label for="season">Season</Label>
                <Input type="select" name="courseSeason" id="season" disabled={onlyDetail}
                      value={item.courseSeason} onChange={this.handleChange} required>
                        {this.seasonsOptions()}
                </Input>
                <UncontrolledTooltip placement="auto" target="season"> Select Season </UncontrolledTooltip>
              </FormGroup>
            </Col>
            <Col xs="2">
            <FormGroup>
              <Label for="year">Year</Label>
              <Input type="number" min="2000" max="2100" name="courseYear" id="year" value={item.courseYear} required
                    onChange={this.handleChange} autoComplete="Course Year" placeholder="Year" disabled={onlyDetail} />
            </FormGroup>
            </Col>
            <Col xs="2">
              <FormGroup>
                <Label for="shift">Shift</Label>
                <Input type="select" name="courseShift" id="shift" disabled={onlyDetail}
                value={item.courseShift} onChange={this.handleChange} required>
                    {this.shiftOptions()}
                </Input>
                <UncontrolledTooltip placement="auto" target="shift"> Select Shift </UncontrolledTooltip>
              </FormGroup>
            </Col>
            <Col xs="4">
              <FormGroup>
                <Label for="location">Location</Label>
                <Input type="text" maxLength="20" name="courseLocation" id="location" value={item.courseLocation || ''} 
                      onChange={this.handleChange} autoComplete="Course Location" placeholder="Location" required disabled={onlyDetail}/>
              </FormGroup>
            </Col>
            <Col xs="2">
              <Label for="lock">{onlyDetail ? 'Lock State' : 'Toggle Lock'}</Label>
              <FormGroup>
              <ButtonGroup size="sm">
                {(onlyDetail && item.courseIsOpen) || !onlyDetail ?
                <>
                <Button outline color="success" id="isOpen" onClick={this.toggleIsOpen} disabled={item.courseIsOpen}>
                  <FontAwesomeIcon icon='lock-open' size="2x" id="lock"/>
                </Button>
                <UncontrolledTooltip placement="auto" target="isOpen"> Unlock Course </UncontrolledTooltip>
                </>
                : '' }
                {(onlyDetail && !item.courseIsOpen) || !onlyDetail ?
                <>
                <Button outline color="danger" id="isClose" onClick={this.toggleIsOpen} disabled={!item.courseIsOpen}>
                  <FontAwesomeIcon icon='lock' size="2x" id="unlock"/>
                </Button>
                <UncontrolledTooltip placement="auto" target="isClose"> Lock Course </UncontrolledTooltip>
                </>
                : '' }
              </ButtonGroup>
              </FormGroup>
            </Col>
          </Row>
        </Form>
        </Container>
        <Container fluid>
          {item.courseId ? 
            <Collapsable entityTypeCapName={'Students'} >
              {this.renderStudents(onlyDetail, actualRol)}
            </Collapsable> : ''
          }
        </Container>
        <Container fluid>
          {item.courseId ?
            <Collapsable entityTypeCapName={'Teachers'}>
              {this.renderTeachers(onlyDetail, actualRol)}
            </Collapsable> : ''
          }
        </Container>
      </AppNavbar>
    </div>
  }

  renderStudents(onlyDetail, actualRol) {
    const courseId = this.props.match.params.id;
    if (courseId !== 'new') {
      return (
        <StudentListContainer 
          studentListTitle = {'Course Students'}
          onGetAll = { (handleSuccess, handleError) => CourseAPI.getCourseStudentsAsync(courseId, handleSuccess, handleError) }
          onDelete = { (studentId, handleSuccess, handleError) => CourseAPI.deleteCourseStudentAsync(studentId, courseId, handleSuccess, handleError)}
          onDeleteConsequenceList = {[
            "The student will no longer be part of this course.", 
            "Student's attendance and grades info will be removed."
          ]}
          addButtonTo = {`/course/${courseId}/addStudents`}
          renderSearch = { false }
          renderButtonBar = {!onlyDetail}
          renderAddButton = {actualRol === 'Cycle Coordinator' || actualRol ===  'Teacher'}
          renderDeleteButton = {actualRol === 'Cycle Coordinator' || actualRol === 'Teacher'}
          renderEditButton= {false}
        />
      );
    }
  }

  renderTeachers(onlyDetail, actualRol) {
    const courseId = this.props.match.params.id;
    if (courseId !== 'new') {
      return (
        <UserListContainer 
          userListTitle = {'Course Teachers'}
          onGetAll = { (handleSuccess, handleError) => CourseAPI.getCourseTeachersAsync(courseId, handleSuccess, handleError) }
          onDelete = { (userId, handleSuccess, handleError) => CourseAPI.deleteCourseTeacherAsync(userId, courseId, handleSuccess, handleError)}
          onDeleteConsequenceList = {[
            "The teacher will no longer be part of this course."
          ]}
          addButtonTo = {`/course/${courseId}/addTeachers`}
          entityType = 'teacher'
          applyDisallowDeleteFunction = { false }
          renderSearch = { false }
          renderButtonBar = {!onlyDetail}
          renderAddButton = {actualRol === 'Cycle Coordinator'}
          renderDeleteButton = {actualRol === 'Cycle Coordinator'}
          renderEditButton= {false}
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
      return (<option key={sj.code}>{sj.name}</option>) 
    }))
  }

  seasonsOptions() {
    return ( this.SeasonOptions.map(sn => {
      return (<option key={sn}>{sn}</option>) 
    }))
  }

  shiftOptions() {
    return ( this.ShiftOptions.map(sf => {
      return (<option key={sf}>{sf}</option>) 
    }))
  }

  setDefaultSubjectName() {
    let {item, subjectList} = {...this.state };
    if (item.subject.name === '') {
      item['subject']['name'] = subjectList[0].name
      item['subject']['code'] = subjectList[0].code
      this.setState({item});
    }
  }

  setDefaultSeason() {
    let {item} = {...this.state };
    if (item.courseSeason === '') { 
      item['courseSeason'] = this.SeasonOptions[1];
      this.setState({item});
    }
  }

  setDefaultShift() {
    let {item} = {...this.state };
    if (item.courseShift === '') { 
      item['courseShift'] = this.ShiftOptions[1];
      this.setState({item});
    }
  }
}

CourseEdit.contextType = userContext;
export default withRouter(CourseEdit);