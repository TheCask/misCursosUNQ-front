import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Table, Button, UncontrolledTooltip } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AppSpinner from './AppSpinner'
import AppNavbar from './AppNavbar'
import ButtonBar from './buttonBar/ButtonBar';
import Log from './Log'
import * as BackAPI from './BackAPI';

class FullCourseList extends Component {
  render() {
    return(
    <div>
        <AppNavbar/>
        <CourseListContainer
          courseListTitle = {'Courses'}
          onGetAll = { (handleSuccess, handleError) => BackAPI.getCoursesAsync(handleSuccess, handleError) }
          onDelete = { (courseId, handleSuccess, handleError) => BackAPI.deleteCourseAsync(courseId, handleSuccess, handleError)}
          onDeleteConsequenceList = {[
            'The course will no longer be available',
            'Students will exit the course',
            'Course lessons will no longer be available',
            'Students will lose their attendance to this course'
          ]}
          addButtonTo = {`/course/new`}
        />
      </div>
    )
  }
}

export class CourseListContainer extends Component {

  constructor(props) {
    super(props);
    this.title = this.props.courseListTitle;
    this.getIcon = this.props.getIcon
    this.state = {courses: [], isLoading: true, targetId: ''};
    this.addButtonTo = props.addButtonTo;
    this.contextParams = props;
  }

  componentDidMount() {
    this.setState({isLoading: true});
    this.contextParams.onGetAll(json => this.setState({courses: json, isLoading: false}, null )); // TODO: replace null by error showing code
  }

  remove(courseId) {
    this.contextParams.onDelete(
      courseId, 
      () => {
        let updatedCourses = [...this.state.courses].filter(course => course.courseId !== courseId);
        this.setState({courses: updatedCourses, targetId: ''});
      },
      null // TODO: replace null by error showing code
    );
  }

  setSelectedRowColor(rowId) {
    if (rowId === this.state.targetId) {
      return {backgroundColor:'#F0F8FF'}
    }
  }

  render() {
    const isLoading = this.state.isLoading;
    if (isLoading) { return (<AppSpinner />) }
    const deleteCourseFunction = () => {this.remove(this.state.targetId)};
    return (
      <div>
        <Container fluid>     
          <ButtonBar 
            entityType='course' 
            targetId = {this.state.targetId} 
            deleteEntityFunction = {deleteCourseFunction} 
            consequenceList = {this.contextParams.onDeleteConsequenceList} 
            addButtonTo = {this.addButtonTo}
          />  
          <h3>{this.title}</h3>
          <Table hover className="mt-4"> 
            <CourseListHeaders />
            <tbody>
              <CourseList 
                courses = {this.state.courses}
                courseOnClickFunction = {(courseId) =>  {this.setState({targetId: courseId})}}
                styleFunction = {(courseId) => this.setSelectedRowColor(courseId)}
                getIconFunction = {(courseCode, courseId) => this.getCourseIcon(courseCode, courseId)}
                booleanFormatterFunction = {(boolean) => this.formatYESoNO(boolean)}
              />
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }

  formatYESoNO(boolean) { return boolean===false ? 'No' : 'Yes'; }

  getCourseIcon(courseCode, courseId) {
    if(courseId === this.state.targetId) {
      switch(courseCode.split("-")[0]) {
        case "80000":
          return (
            <span className="fa-layers fa-fw">
              <FontAwesomeIcon icon='book' size="1x" color="darkred" transform="left-10 up-10"/>
              <FontAwesomeIcon icon='book-reader' size="1x" color="darkred" transform="right-10 up-10"/>
              <FontAwesomeIcon icon='pencil-alt' size="1x" color="darkred" transform="left-10 down-10"/>
              <FontAwesomeIcon icon='graduation-cap' size="1x" color="darkred" transform="right-10 down-10"/>
            </span>)
        case "80005":
          return (
            <span className="fa-layers fa-fw">
              <FontAwesomeIcon icon='bug' size="1x" color="black" transform="left-10 up-10"/>
              <FontAwesomeIcon icon='microchip' size="1x" color="black" transform="right-10 up-10"/>
              <FontAwesomeIcon icon='laptop-code' size="1x" color="black" transform="left-10 down-10"/>
              <FontAwesomeIcon icon='project-diagram' size="1x" color="black" transform="right-10 down-10"/>
            </span>)
        case "80003":
          return (
            <span className="fa-layers fa-fw">
              <FontAwesomeIcon icon='brain' size="1x" color="darkblue" transform="left-10 up-10"/>
              <FontAwesomeIcon icon='shapes' size="1x" color="darkblue" transform="right-10 up-10"/>
              <FontAwesomeIcon icon='infinity' size="1x" color="darkblue" transform="left-10 down-10"/>
              <FontAwesomeIcon icon='calculator' size="1x" color="darkblue" transform="right-10 down-10"/>
            </span>)
        case "80004":
          return (
            <span className="fa-layers fa-fw">
              <FontAwesomeIcon icon='thermometer-half' size="1x" color="darkgreen" transform="left-10 up-10"/>
              <FontAwesomeIcon icon='atom' size="1x" color="darkgreen" transform="right-10 up-10"/>
              <FontAwesomeIcon icon='flask' size="1x" color="darkgreen" transform="left-10 down-10"/>
              <FontAwesomeIcon icon='magnet' size="1x" color="darkgreen" transform="right-10 down-10"/>
            </span>)
        default:
          return <FontAwesomeIcon icon={['fas', 'chalkboard']} size="2x" color="gray"/>
      }
    }
    else { return ''}  
  }
}
    
const CourseListHeaders = () =>
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
  
const CourseList = props => {
  return props.courses.map( (course, index) => {
    const courseOnClickFunction = () => props.courseOnClickFunction(course.courseId);
    const getIconFunction = (courseCode, courseId) => props.getIconFunction(courseCode, courseId);
    const booleanFormatterFunction = (boolean) => props.booleanFormatterFunction(boolean); 
    return (
      <CourseListItem
        key = {index}
        course = {course} 
        courseOnClickFunction = {courseOnClickFunction} 
        style = {props.styleFunction(course.courseId)}
        getIconFunction = {getIconFunction}
        booleanFormatter = {booleanFormatterFunction}
      />
    )
  });
}
    
const CourseListItem = props => {
  return (
    <tr onClick={props.courseOnClickFunction} id={props.course.courseId} style={props.style}> 
      <td style={{textAlign: 'center'}}> {props.getIconFunction(props.course.courseCode, props.course.courseId) || ''}</td>
      <td style={{whiteSpace: 'nowrap'}}>{props.course.courseName || ''}</td>
      <td style={{whiteSpace: 'nowrap'}}>{props.course.courseCode || ''}</td>
      <td style={{whiteSpace: 'nowrap'}}>{props.course.courseShift || ''}</td>
      <td style={{whiteSpace: 'nowrap'}}>{props.booleanFormatter(props.course.courseIsOpen) || ''}</td>
      <td style={{whiteSpace: 'nowrap'}}>{props.course.students.length || ''}</td>
      <td style={{whiteSpace: 'nowrap'}}>{props.course.lessons.length || ''}</td>
      <td>
        <Button size="sm" color="success" outline block tag={Link} to={`/course/${props.course.courseId}/lessons`} id={"attendance_" + props.course.courseId}>
          <UncontrolledTooltip placement="auto" target={"attendance_" + props.course.courseId}>
            Take Attendance
          </UncontrolledTooltip>         
          <FontAwesomeIcon icon={['fas', 'tasks']} size="1x"/>
        </Button>
      </td>
    </tr>
  )
}

export default FullCourseList;