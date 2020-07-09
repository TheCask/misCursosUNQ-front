import React from 'react';
import { userContext } from '../login/UserContext';
import { Link } from 'react-router-dom';
import { Container, Table, ButtonGroup, Button, UncontrolledTooltip, Form } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AppSpinner from '../auxiliar/AppSpinner';
import AppNavbar from '../AppNavbar';
import DetailButton from '../buttons/DetailButton';
import AccessError from '../errorHandling/AccessError';
import ComponentWithErrorHandling from '../errorHandling/ComponentWithErrorHandling';
import * as CourseAPI from '../services/CourseAPI';
import * as UserAPI from '../services/UserAPI';
import * as Constants from '../auxiliar/Constants'

class AddTeachersToCourse extends ComponentWithErrorHandling {

  constructor(props) {
    super(props);
    this.state = {
      courseTeachersIds: [], 
      allTeachers: [],
      item: Constants.emptyCourse,
      isLoading: true,
      currentTeacherId: ''};
    this.toggleAssignment = this.toggleAssignment.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});
    CourseAPI.getCourseByIdAsync(
      this.props.match.params.id, 
      json => this.setState({item: json}), 
      this.showError("get course"));
    UserAPI.getUsersByActiveStatusAsync(
      true, 
      json => {
        this.collectUsersIds(this.state.item.teachers);
        this.setState({allTeachers: json, isLoading: false})
      },
      this.showError("get teachers"));
  }

  async handleSubmit(event) {
    event.preventDefault();
    // const {item} = this.state;
    let item = {...this.state.item};
    let teachers = this.state.courseTeachersIds
    item['teachers'] = teachers
    item['lessons'] = []
    this.setState({item: item})
    CourseAPI.postCourseAsync(item, 
      () => this.props.history.push(`/course/${item.courseId}`), 
      this.showError("save course"));
  }

  toggleAssignment(usUserId) {
    let courseTeachers = this.state.item.teachers
    if (!courseTeachers.find(us => us.userId === usUserId)) {
      let teacherList = this.state.courseTeachersIds
      let teacher = {userId: usUserId}
      if (teacherList.find(us => us.userId === usUserId)) {
        const newTeacherList = teacherList.filter(us => us.userId !== usUserId)
        teacherList = newTeacherList
      }
      else { teacherList = teacherList.concat(teacher) }
      this.setState({courseTeachersIds: teacherList})
    }
  }

  // takes the list of course teachers from api and sets the list of teacher userIds in state
  collectUsersIds(teachers) {
    let teachers4JSON = teachers.map(teacher => {
      return {userId: teacher['userId']}
      })
    this.setState({courseTeachersIds: teachers4JSON})
  }

  render() {
    const {isLoading} = this.state;
    if (isLoading) { return <AppSpinner /> }
    const targetId = this.state.currentTeacherId
    this.actualRol = this.context.actualRol;
    return (this.actualRol !== 'Cycle Coordinator' ?
      <AccessError errorCode="Guests are not allowed" 
          errorDetail="Make sure you are signed in with valid role before try to access this page"/>
      : 
      <div>
        <AppNavbar>
          <Container fluid> 
            <Form onSubmit={this.handleSubmit}>
              <ButtonGroup className="float-right" inline="true">
                <Button size="sm" color="primary" type="submit" id='addTeacherToCourse'>
                  <UncontrolledTooltip placement="auto" target='addTeacherToCourse'>
                    Add Selected Teachers to Course
                  </UncontrolledTooltip>
                  <FontAwesomeIcon icon="save" size="2x"/>
                </Button>
                <DetailButton entityTypeCapName = {'Teacher'} targetId = {targetId} to = {`/user/${targetId}/detail`}/>
                <Button  size="sm" color="secondary" tag={Link} to={`/course/${this.state.item.courseId}`} id="backToCourse">
                  <UncontrolledTooltip placement="auto" target="backToCourse">
                    Discard and Back to Course
                  </UncontrolledTooltip>
                  <FontAwesomeIcon icon='backward' size="2x"/>
                </Button>
                </ButtonGroup>
            </Form>
            <h3>Add Teachers to Course</h3>
            <Table className="mt-4"> 
              <TeacherListHeaders/>
              <tbody>
                <TeacherList
                  courseTeachersIds = {this.state.courseTeachersIds}
                  allTeachers = {this.state.allTeachers}
                  teacherOnClickFunction = {(userId) => {this.toggleAssignment(userId)}}
                  styleFunction = {(userId) => this.setRowColor(userId)}
                  setIconFunction = {(userId) => this.setRowIcon(userId)}
                />
              </tbody>
            </Table>
          </Container>
        </AppNavbar>
      </div>
    );
  }

  setRowIcon(usUserId) {
    if (this.state.courseTeachersIds.find(us => us.userId === usUserId)) {
      return <FontAwesomeIcon icon='check' size="2x" color='#90EE90'/>
    }
    else { return <FontAwesomeIcon icon='times' size="2x" color='#CD5C5C' /> } 
  }

  setRowColor(rowId) {
    if (this.state.courseTeachersIds.find(us => us.userId === rowId)) {
      return {backgroundColor:'#F0FFF0'}
    }
    else { return {backgroundColor:'#FFF0F5'} }
  }
}
AddTeachersToCourse.contextType = userContext;

const th = Constants.tableHeader
const TeacherListHeaders = () =>
  <thead>
    <tr>
      <th style={th}>DNI</th>
      <th style={th}>First Name</th>
      <th style={th}>Last Name</th>
      <th style={th}>e-Mail</th>
      <th style={th}>Cell Phone</th>
      <th style={th}>Dedication</th>
      <th style={th}>Selected</th>
    </tr>
  </thead>;

const TeacherList = props => {
  return props.allTeachers.map( (teacher, index) => {
    const teacherOnClickFunction = () => props.teacherOnClickFunction(teacher.userId);
    const setIconFunction = (userId) => props.setIconFunction(userId);
    return (
      <TeacherListItem
        key = {index}
        user = {teacher} 
        teacherOnClickFunction = {teacherOnClickFunction} 
        style = {props.styleFunction(teacher.userId)}
        setIconFunction = {setIconFunction}
      />
    )
  });
}

const tr = Constants.tableRow
const TeacherListItem = props => 
  <tr onClick={props.teacherOnClickFunction} id={props.user.userId} style={props.style}> 
    <td style={tr}>{props.user.personalData.dni || ''}</td>
    <td style={tr}>{props.user.personalData.firstName || ''}</td>
    <td style={tr}>{props.user.personalData.lastName || ''}</td>
    <td style={tr}>{props.user.personalData.email || ''}</td>
    <td style={tr}>{props.user.jobDetail.dedication || ''}</td>
    <td style={tr}>{props.user.jobDetail.aditionalHours || ''}</td>
    <td style={{textAlign: 'center'}}> {props.setIconFunction(props.user.userId)}</td>
  </tr>;

export default AddTeachersToCourse;