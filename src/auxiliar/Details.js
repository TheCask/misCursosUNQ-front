import React, { Component } from 'react';
import UserEdit from '../user/UserEdit'
import StudentEdit from '../student/StudentEdit'
import SubjectEdit from '../subject/SubjectEdit'
import CourseEdit from '../course/CourseEdit'
import { userContext } from '../login/UserContext';
import AccessError from '../errorHandling/AccessError';

export class UserDetail extends Component {
  render() {
    this.actualRol = this.context.actualRol;
    return (this.actualRol === 'Guest' ?
      <AccessError errorCode="Guests are not allowed" 
          errorDetail="Make sure you are signed in with valid role before try to access this page"/>
      : 
      <UserEdit onlyDetail={true}/>
    )
  }
}

export class StudentDetail extends Component {
  render() {
    this.actualRol = this.context.actualRol;
    return (this.actualRol === 'Guest' ?
      <AccessError errorCode="Guests are not allowed" 
          errorDetail="Make sure you are signed in with valid role before try to access this page"/>
      : 
      <StudentEdit onlyDetail={true}/>
    )
  }
}

export class SubjectDetail extends Component {
  render() {
    this.actualRol = this.context.actualRol;
    return (this.actualRol === 'Guest' ?
      <AccessError errorCode="Guests are not allowed" 
          errorDetail="Make sure you are signed in with valid role before try to access this page"/>
      : 
      <SubjectEdit onlyDetail={true}/>
    )
  }
}

export class CourseDetail extends Component {
  render() {
    this.actualRol = this.context.actualRol;
    return (this.actualRol === 'Guest' ?
      <AccessError errorCode="Guests are not allowed" 
          errorDetail="Make sure you are signed in with valid role before try to access this page"/>
      : 
      <CourseEdit onlyDetail={true}/>
    )
  }
}

UserDetail.contextType = userContext;
StudentDetail.contextType = userContext;
SubjectDetail.contextType = userContext;
CourseDetail.contextType = userContext;