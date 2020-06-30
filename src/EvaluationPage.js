import React from 'react';
import ComponentWithErrorHandling from './errorHandling/ComponentWithErrorHandling'
import CourseEvaluations from './CourseEvaluations';


export default class EvaluationPage extends ComponentWithErrorHandling {

  render() { return <CourseEvaluations courseId={this.props.match.params.id} showError={this.showError} /> }
}
