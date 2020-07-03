import React from 'react';
import ComponentWithErrorHandling from '../errorHandling/ComponentWithErrorHandling'
import CourseEvaluations from './CourseEvaluations';
import { userContext } from '../login/UserContext';
import AccessError from '../errorHandling/AccessError';

export default class EvaluationPage extends ComponentWithErrorHandling {
  
  render() { 
    this.actualRol = this.context.actualRol;
    return (this.actualRol !== 'Teacher' ?
      <AccessError errorCode="Guests are not allowed" 
          errorDetail="Make sure you are signed in with valid role before try to access this page"/>
      : 
      <CourseEvaluations courseId={this.props.match.params.id} showError={this.showError} />
    )
  }
}
EvaluationPage.contextType = userContext;