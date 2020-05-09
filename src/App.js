import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// LOCAL
import './App.css';
import CourseListContainer from './CourseList';
import Attendance from './Attendance';
import CourseEdit from './CourseEdit';
import StudentListContainer from './StudentList';
import StudentEdit from './StudentEdit';
import SubjectListContainer from './SubjectList';
import SubjectEdit from './SubjectEdit';
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
          <Route path='/' exact={true} component={CourseListContainer}/>
          <Route path='/courses' exact={true} component={CourseListContainer}/>
          <Route path='/course/:id' component={CourseEdit}/>
          <Route path='/course/:id/lessons' component={Attendance}/>
          <Route path='/students' exact={true} component={StudentListContainer}/>
          <Route path='/student/:id' component={StudentEdit}/>
          <Route path='/subjects' exact={true} component={SubjectListContainer}/>
          <Route path='/subject/:id' component={SubjectEdit}/>
        </Switch>
      </Router>
    )
  }
}

export default App;