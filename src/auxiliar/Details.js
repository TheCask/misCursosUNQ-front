import React, { Component } from 'react';
import UserEdit from '../user/UserEdit'
import StudentEdit from '../student/StudentEdit'
import SubjectEdit from '../subject/SubjectEdit'
import CourseEdit from '../course/CourseEdit'

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