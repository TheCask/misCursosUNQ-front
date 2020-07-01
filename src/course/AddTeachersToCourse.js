import React from 'react';
import { Container, Table, ButtonGroup, Button, UncontrolledTooltip, Form } from 'reactstrap';
import AppSpinner from '../auxiliar/AppSpinner';
import AppNavbar from '../AppNavbar';
import { Link } from 'react-router-dom';
import DetailButton from '../buttons/DetailButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as CourseAPI from '../services/CourseAPI';
import * as UserAPI from '../services/UserAPI';
import ComponentWithErrorHandling from '../errorHandling/ComponentWithErrorHandling';

class AddTeachersToCourse extends ComponentWithErrorHandling {

  emptyItem = {
    courseCode: '',
    courseShift: '',
    courseIsOpen: '',
    courseYear: 0,
    courseSeason: '',
    courseLocation: '',
    subject: {
        code: ''
    },
    teachers: []
  };

  constructor(props) {
    super(props);
    this.state = {
      courseTeachersIds: [], 
      allTeachers: [],
      item: this.emptyItem,
      isLoading: true,
      currentTeacherId: ''};
    this.toggleAssignment = this.toggleAssignment.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});
    CourseAPI.getCourseByIdAsync(this.props.match.params.id, 
      json => this.setState({item: json}), 
      this.showError("get course"));
    UserAPI.getUsersAsync(json => {
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
    return (
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

const TeacherListHeaders = () =>
  <thead>
    <tr>
      <th width="3%">DNI</th>
      <th width="7%">First Name</th>
      <th width="7%">Last Name</th>
      <th width="7%">e-Mail</th>
      <th width="4%">Cell Phone</th>
      <th width="2%">Dedication</th>
      <th width="1%">Aditional Hours</th>
      <th width="3%">Selected</th>
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

const TeacherListItem = props => 
  <tr onClick={props.teacherOnClickFunction} id={props.user.userId} style={props.style}> 
    <td style={{whiteSpace: 'nowrap'}}>{props.user.personalData.dni || ''}</td>
    <td style={{whiteSpace: 'nowrap'}}>{props.user.personalData.firstName || ''}</td>
    <td style={{whiteSpace: 'nowrap'}}>{props.user.personalData.lastName || ''}</td>
    <td style={{whiteSpace: 'nowrap'}}>{props.user.personalData.email || ''}</td>
    <td style={{whiteSpace: 'nowrap'}}>{props.user.personalData.cellPhone || ''}</td>
    <td style={{whiteSpace: 'nowrap'}}>{props.user.jobDetail.dedication || ''}</td>
    <td style={{whiteSpace: 'nowrap'}}>{props.user.jobDetail.aditionalHours || ''}</td>
    <td style={{textAlign: 'center'}}> {props.setIconFunction(props.user.userId)}</td>
  </tr>;

export default AddTeachersToCourse;
