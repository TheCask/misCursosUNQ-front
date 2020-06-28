import React  from 'react';
import { Link } from 'react-router-dom';
import { Container, Table, Button, UncontrolledTooltip } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AppSpinner from './AppSpinner'
import AppNavbar from './AppNavbar'
import AccessError from './AccessError';
import ButtonBar from './buttonBar/ButtonBar';
import * as CourseAPI from './services/CourseAPI';
import * as UserAPI from './services/UserAPI';
import ComponentWithErrorHandling from './errorHandling/ComponentWithErrorHandling'
import { userContext } from './login/UserContext';

class FullCourseList extends ComponentWithErrorHandling {

  constructor(props) {
    super(props);
    this.state = {...this.state };
    this.actualRol = 'Guest';
  };

  render() {
    this.actualRol = this.context.actualRol;
    return(
      <div>
        <AppNavbar>
        {this.renderErrorModal()}
          <CourseListContainer
            courseListTitle = {'Courses'}
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
            disableAttendanceBt = {this.disableAttendanceBt()}
            deleteButtonTo = {'./'} //required by delete button
          />
        </AppNavbar>
      </div>
    )
  }

  renderButtonBar() {
    switch (this.actualRol) {
      case 'Cycle Coordinator': return true
      case 'Teacher': return true
      case 'Guest': return false
      default: return false
    }
  }

  disableAttendanceBt() {
    return this.actualRol !== 'Teacher'
  }

  renderAddButton() {
    switch (this.actualRol) {
      case 'Cycle Coordinator': return true
      case 'Teacher': return false
      case 'Guest': return false
      default: return false
    }
  }

  renderDeleteButton() {
    switch (this.actualRol) {
      case 'Cycle Coordinator': return true
      case 'Teacher': return false
      case 'Guest': return false
      default: return false
    }
  }

  rolCourses() {
    let rolCourses
    switch (this.actualRol) {
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
    this.title = this.props.courseListTitle;
    this.getIcon = this.props.getIcon
    this.addButtonTo = props.addButtonTo;
    this.renderEditButton = props.renderEditButton;
    this.renderButtonBar = props.renderButtonBar;
    this.renderAddButton = props.renderAddButton;
    this.renderDeleteButton = props.renderDeleteButton;
    this.disableAttendanceBt = props.disableAttendanceBt;
    this.deleteButtonTo=props.deleteButtonTo;
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

  render() {
    if (false) { return (<AppSpinner />) }
    const deleteCourseFunction = () => {this.remove(this.state.targetId)};
    return (
      <div>
        {this.renderErrorModal()}
        <Container fluid>
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
          <h3>{this.title}</h3>
          <Table hover className="mt-4"> 
            <CourseListHeaders />
            <tbody>
              <CourseList 
                courses = {this.state.courses}
                courseOnClickFunction = {(courseId) =>  {this.setState({targetId: courseId})}}
                styleFunction = {(courseId) => this.setSelectedRowColor(courseId)}
                getIconFunction = {(subjectCode, courseId) => this.getCourseIcon(subjectCode, courseId)}
                booleanFormatterFunction = {(boolean) => this.formatYESoNO(boolean)}
                disableAttendanceBt = {this.disableAttendanceBt}
              />
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }

  formatYESoNO(boolean) { return boolean===false ? 'No' : 'Yes'; }

  getCourseIcon(subjectCode, courseId) {
    if(courseId === this.state.targetId) {
      switch(subjectCode.split("-")[0]) {
        case "80000":
          return (<> <FontAwesomeIcon icon='book' size="1x" color="darkred" transform="left-10 up-10"/>
                    <FontAwesomeIcon icon='book-reader' size="1x" color="darkred" transform="right-10 up-10"/>
                    <FontAwesomeIcon icon='pencil-alt' size="1x" color="darkred" transform="left-10 down-10"/>
                    <FontAwesomeIcon icon='graduation-cap' size="1x" color="darkred" transform="right-10 down-10"/> </>);
        case "80005":
          return (<> <FontAwesomeIcon icon='bug' size="1x" color="black" transform="left-10 up-10"/>
                    <FontAwesomeIcon icon='microchip' size="1x" color="black" transform="right-10 up-10"/>
                    <FontAwesomeIcon icon='laptop-code' size="1x" color="black" transform="left-10 down-10"/>
                    <FontAwesomeIcon icon='project-diagram' size="1x" color="black" transform="right-10 down-10"/> </>);
        case "80003":
          return (<> <FontAwesomeIcon icon='brain' size="1x" color="darkblue" transform="left-10 up-10"/>
                    <FontAwesomeIcon icon='shapes' size="1x" color="darkblue" transform="right-10 up-10"/>
                    <FontAwesomeIcon icon='infinity' size="1x" color="darkblue" transform="left-10 down-10"/>
                    <FontAwesomeIcon icon='calculator' size="1x" color="darkblue" transform="right-10 down-10"/> </>);
        case "80004":
          return (<> <FontAwesomeIcon icon='thermometer-half' size="1x" color="darkgreen" transform="left-10 up-10"/>
                    <FontAwesomeIcon icon='atom' size="1x" color="darkgreen" transform="right-10 up-10"/>
                    <FontAwesomeIcon icon='flask' size="1x" color="darkgreen" transform="left-10 down-10"/>
                    <FontAwesomeIcon icon='magnet' size="1x" color="darkgreen" transform="right-10 down-10"/> </>);
        default: return <FontAwesomeIcon icon={['fas', 'chalkboard']} size="2x" color="gray"/>
      }
    }
    else { return ''}  
  }
}
  
const CourseList = props => {
  return props.courses.map( (course, index) => {
    const courseOnClickFunction = () => props.courseOnClickFunction(course.courseId);
    const getIconFunction = (subjectCode, courseId) => props.getIconFunction(subjectCode, courseId);
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
      <th width="1%">Lessons</th>
      <th width="1%">Attendance</th>
    </tr>
  </thead>

const CourseListItem = props => {
  return (
    <tr onClick={props.courseOnClickFunction} id={props.course.courseId} style={props.style}> 
      <td style={{textAlign: 'center'}}> 
        <span className="fa-layers fa-fw" style={{marginLeft: '-50px', marginRight: '-50px'}}>
          { props.getIconFunction(props.course.subject.code, props.course.courseId) || '' }
        </span>
      </td>
      <td style={{whiteSpace: 'nowrap'}}>{props.course.courseCode || ''}</td>
      <td style={{whiteSpace: 'nowrap'}}>{props.course.subject.acronym || ''}</td>
      <td style={{whiteSpace: 'nowrap'}}>
        {props.course.courseSeason || ''}{' '}{props.course.courseYear || ''}
      </td>
      <td style={{whiteSpace: 'nowrap'}}>{props.course.courseShift || ''}</td>
      <td style={{whiteSpace: 'nowrap'}}>{props.booleanFormatter(props.course.courseIsOpen) || ''}</td>
      <td style={{whiteSpace: 'nowrap'}}>{props.course.students.length || 0}</td>
      <td style={{whiteSpace: 'nowrap'}}>{props.course.lessons.length || 0 }</td>
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
FullCourseList.contextType = userContext;
CourseListContainer.contextType = userContext;
export default FullCourseList;