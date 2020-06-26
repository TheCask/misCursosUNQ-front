import React, { Component } from 'react'; //{Component}
import UserEdit from './UserEdit'
import StudentEdit from './StudentEdit'
import SubjectEdit from './SubjectEdit'
import CourseEdit from './CourseEdit'

export class UserDetail extends Component {
  render() {
    return( <UserEdit onlyDetail={true}/>)
  }
}

export class StudentDetail extends Component {
  render() {
    return( <StudentEdit onlyDetail={true}/>)
  }
}

export class SubjectDetail extends Component {
  render() {
    return( <SubjectEdit onlyDetail={true}/>)
  }
}

export class CourseDetail extends Component {
  render() {
    return( <CourseEdit onlyDetail={true}/>)
  }
}