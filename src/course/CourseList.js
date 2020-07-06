import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Table, Button, UncontrolledTooltip, Row, Col, Label } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AppSpinner from '../auxiliar/AppSpinner'
import AppNavbar from '../AppNavbar'
import AccessError from '../errorHandling/AccessError';
import ButtonBar from '../buttons/ButtonBar';
import * as CourseAPI from '../services/CourseAPI';
import * as UserAPI from '../services/UserAPI';
import ComponentWithErrorHandling from '../errorHandling/ComponentWithErrorHandling'
import { userContext } from '../login/UserContext';
import * as IconRepo from '../auxiliar/IconRepo'

class FullCourseList extends ComponentWithErrorHandling {

  constructor(props) {
    super(props);
    this.state = {...this.state, lastRol: 'Guest'};
  };

  componentDidUpdate() {
    if (this.context.actualRol !== this.state.lastRol) {
      this.setState({lastRol: this.context.actualRol});
    }
  }

  componentDidMount() {
    this.setState({lastRol: this.context.actualRol})
  }

  render() {
    let actualRol = this.context.actualRol;
    return (
      <div>
        <AppNavbar>
        {this.renderErrorModal()}
        { actualRol === this.state.lastRol ?
          <CourseListContainer
            courseListTitle = {'Courses for ' + actualRol }
            onGetAll = {this.rolCourses()}
            onDelete = { (courseId, handleSuccess, handleError) => CourseAPI.deleteCourseAsync(courseId, handleSuccess, handleError)}
            onDeleteConsequenceList = {[
              'The course will no longer be available',
              'Students will exit the course',
              'Course lessons will no longer be available',
              'Students will lose their attendance to this course'
            ]}
            addButtonTo = {`/course/new`}
            renderEditButton = {true}
            renderAddButton = {this.renderAddButton()}
            renderDeleteButton = {this.renderDeleteButton()}
            renderButtonBar = {this.renderButtonBar()}
            disableAttendanceBt = {actualRol !== 'Teacher'}
            disableEvaluationBt = {actualRol !== 'Teacher'}
            deleteButtonTo = {'./'} //required by delete button
          />
          : <h3>{actualRol}</h3> }
        </AppNavbar>
      </div>
    )
  }

  renderButtonBar() {
    switch (this.context.actualRol) {
      case 'Cycle Coordinator': return true
      case 'Teacher': return true
      case 'Guest': return false
      default: return false
    }
  }

  renderAddButton() {
    switch (this.context.actualRol) {
      case 'Cycle Coordinator': return true
      case 'Teacher': return false
      case 'Guest': return false
      default: return false
    }
  }

  renderDeleteButton() {
    switch (this.context.actualRol) {
      case 'Cycle Coordinator': return true
      case 'Teacher': return false
      case 'Guest': return false
      default: return false
    }
  }

  rolCourses() {
    let rolCourses
    switch (this.context.actualRol) {
      case 'Teacher': {
        let email = this.context.globalUser ? this.context.globalUser.email : '';
        rolCourses = (handleSuccess, handleError) => 
          UserAPI.getUserCoursesByEmailAsync(email, handleSuccess, handleError);
      }
      break;
      case 'Cycle Coordinator': rolCourses = (handleSuccess, handleError) => 
        CourseAPI.getCoursesAsync(handleSuccess, handleError)
      break;
      case 'Guest': rolCourses = (handleSuccess, handleError) => 
        CourseAPI.getCoursesAsync(handleSuccess, handleError)
      break;
      default: rolCourses = () => this.accessError()
    }
    return rolCourses;
  }

  accessError() {
    return ( 
      <AccessError errorCode="User Not Logged" 
        errorDetail="Make sure you are signed in before try to access this page"/>
    )
  }
}

export class CourseListContainer extends ComponentWithErrorHandling {

  constructor(props) {
    super(props);
    this.state = {...this.state, 
      ...{courses: [], isLoading: true, targetId: '', 
      coursesListTitle: 'Courses'}};
    this.title = props.courseListTitle;
    this.getIcon = this.props.getIcon
    this.addButtonTo = props.addButtonTo;
    this.renderEditButton = props.renderEditButton;
    this.renderButtonBar = props.renderButtonBar;
    this.renderAddButton = props.renderAddButton;
    this.renderDeleteButton = props.renderDeleteButton;
    this.disableAttendanceBt = props.disableAttendanceBt;
    this.disableEvaluationBt = props.disableEvaluationBt;
    this.deleteButtonTo = props.deleteButtonTo;
    this.contextParams = props;
  }

  componentDidMount() {
    this.setState({isLoading: true});
    this.contextParams.onGetAll(json => this.setState({courses: json, isLoading: false}),
      this.showError("get courses"));
  }

  remove(courseId) {
    this.contextParams.onDelete(
      courseId, 
      () => {
        let updatedCourses = [...this.state.courses].filter(course => course.courseId !== courseId);
        this.setState({courses: updatedCourses, targetId: ''});
      },
      this.showError("delete course")
    );
  }

  setSelectedRowColor(rowId) {
    if (rowId === this.state.targetId) {
      return {backgroundColor:'#F0F8FF'}
    }
  }

  formatYESoNO(boolean) { return boolean===false ? 'No' : 'Yes'; }

  render() {
    if (false) { return (<AppSpinner />) }
    const deleteCourseFunction = () => {this.remove(this.state.targetId)};
    return (
      <div>
        {this.renderErrorModal()}
        <Container fluid>
          <Row xs="2">
            <Col> <h3>{this.title}</h3> </Col>
            <Col>
              { this.renderButtonBar ?
              <ButtonBar 
                entityType='course'
                targetId = {this.state.targetId} 
                deleteEntityFunction = {deleteCourseFunction} 
                consequenceList = {this.contextParams.onDeleteConsequenceList} 
                addButtonTo = {this.addButtonTo}
                renderEditButton = {this.renderEditButton}
                renderAddButton = {this.renderAddButton}
                renderDeleteButton = {this.renderDeleteButton}
                deleteButtonTo={this.deleteButtonTo} // required by delete button
              /> : '' }
            </Col>
          </Row>
          <div style={{ maxHeight:720, overflowY:'scroll'}}>
          <Table hover className="mt-4"> 
            <CourseListHeaders />
            <tbody>
              <CourseList 
                courses = {this.state.courses}
                courseOnClickFunction = {(courseId) =>  {this.setState({targetId: courseId})}}
                styleFunction = {(courseId) => this.setSelectedRowColor(courseId)}
                getIconFunction = {(subjectCode) => IconRepo.getCourseIcon(subjectCode)}
                booleanFormatterFunction = {(boolean) => this.formatYESoNO(boolean)}
                disableAttendanceBt = {this.disableAttendanceBt}
                disableEvaluationBt = {this.disableEvaluationBt}
                targetId = {this.state.targetId}
              />
            </tbody>
          </Table>
          </div>
        </Container>
      </div>
    );
  }
}
  
const CourseList = props => {
  return props.courses.map( (course, index) => {
    const courseOnClickFunction = () => props.courseOnClickFunction(course.courseId);
    const getIconFunction = (subjectCode) => props.getIconFunction(subjectCode);
    const booleanFormatterFunction = (boolean) => props.booleanFormatterFunction(boolean); 
    return (
      <CourseListItem
        key = {index}
        course = {course} 
        courseOnClickFunction = {courseOnClickFunction} 
        style = {props.styleFunction(course.courseId)}
        getIconFunction = {getIconFunction}
        booleanFormatter = {booleanFormatterFunction}
        disableAttendanceBt = {props.disableAttendanceBt}
        disableEvaluationBt = {props.disableEvaluationBt}
        showIcon = {props.targetId === course.courseId }
      />
    )
  });
}

const CourseListHeaders = () =>
  <thead>
    <tr>
      <th width="1%"></th>
      <th width="2%">Code</th>
      <th width="3%">Subject</th>
      <th width="3%">Season</th>
      <th width="3%">Shift</th>
      <th width="2%">Open</th>
      <th width="1%">Students</th>
      <th width="1%">Evaluations</th>
      <th width="1%">Lessons</th>
      <th width="1%">Attendance</th>
    </tr>
  </thead>

const CourseListItem = props => {
  const tdStyle = {whiteSpace: 'nowrap', textAlign: 'center'};
  return (
    <tr onClick={props.courseOnClickFunction} id={props.course.courseId} style={props.style}> 
      <td style={{textAlign: 'center'}}> 
        <span className="fa-layers fa-fw" style={{marginLeft: '-50px', marginRight: '-50px'}}>
          { props.showIcon ? props.getIconFunction(props.course.subject.code) : '' }
        </span>
      </td>
      <td style={tdStyle}>{props.course.courseCode || ''}</td>
      <td style={tdStyle}>{props.course.subject.acronym || ''}</td>
      <td style={tdStyle}>
        {props.course.courseSeason || ''}{' '}{props.course.courseYear || ''}
      </td>
      <td style={tdStyle}>{props.course.courseShift || ''}</td>
      <td style={tdStyle}>{props.booleanFormatter(props.course.courseIsOpen) || ''}</td>
      <td style={tdStyle}>{props.course.students.length || 0}</td>
      <td style={tdStyle}>{
          <Button size="sm" color="secondary" outline block tag={Link} to={`/course/${props.course.courseId}/evaluations`} 
            id={"evals_" + props.course.courseId} disabled={props.disableEvaluationBt} >
            <UncontrolledTooltip placement="auto" target={"evals_" + props.course.courseId}>
              Go to Course evaluations
            </UncontrolledTooltip>         
            {props.course.evaluations.length || 0}
          </Button>
      }</td>
      <td style={tdStyle}>{props.course.lessons.length || 0 }</td>
      <td>
        <Button size="sm" color="success" outline block tag={Link} to={`/course/${props.course.courseId}/lessons`} 
          id={"attendance_" + props.course.courseId} disabled={props.disableAttendanceBt}>
          <UncontrolledTooltip placement="auto" target={"attendance_" + props.course.courseId}>
            Take Attendance
          </UncontrolledTooltip>         
          <FontAwesomeIcon icon={['fas', 'tasks']} size="1x"/>
        </Button>
      </td>
    </tr>
  )
}
CourseListContainer.contextType = userContext;
FullCourseList.contextType = userContext;
export default FullCourseList;