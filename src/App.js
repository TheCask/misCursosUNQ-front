import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// LOCAL
import './App.css';
import FullCourseList from './CourseList';
import CourseEdit from './CourseEdit';
import AddStudentsToCourse from './AddStudentsToCourse';
import AddTeachersToCourse from './AddTeachersToCourse';
import AddCoordinatorsToSubject from './AddCoordinatorsToSubject'
import Attendance from './Attendance';
import FullStudentList from './StudentList';
import StudentEdit from './StudentEdit';
import FullSubjectList from './SubjectList';
import SubjectEdit from './SubjectEdit';
import FullUserList from './UserList';
import UserEdit from './UserEdit';
//import EvaluationPage from './Evaluation';
import EXPERIMENTING from './EXPERIMENTING';
// FONT AWESOME
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faCheckSquare, faCoffee } from '@fortawesome/free-solid-svg-icons'

library.add(fab, fas, faCheckSquare, faCoffee)

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path='/' exact={true} component={FullCourseList}/>
          <Route path='/courses' exact={true} component={FullCourseList}/>
          <Route path='/course/:id/lessons' component={Attendance}/>
          <Route path='/course/:id/addStudents' component={AddStudentsToCourse}/>
          <Route path='/course/:id/addTeachers' component={AddTeachersToCourse}/>
          {/* <Route path='/course/:id/evaluations' component={EvaluationPage}/> */}
          <Route path='/course/:id' component={CourseEdit}/>
          <Route path='/students' exact={true} component={FullStudentList}/>
          <Route path='/student/:id' component={StudentEdit}/>
          <Route path='/subjects' exact={true} component={FullSubjectList}/>
          <Route path='/subject/:id/addCoordinators' component={AddCoordinatorsToSubject}/>
          <Route path='/subject/:id' component={SubjectEdit}/>
          <Route path='/users' exact={true} component={FullUserList}/>
          <Route path='/user/:id' component={UserEdit}/>
          <Route path='/experimenting' component={EXPERIMENTING}/>
{/*           <Route path='/evaluation' component={EvaluationPage}/> */}

        </Switch>
      </Router>
    )
  }
}

export default App;