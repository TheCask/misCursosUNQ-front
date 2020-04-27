import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// LOCAL
import './App.css';
import CourseList from './CourseList';
import Attendance from './Attendance';
import CourseEdit from './CourseEdit';
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
          <Route path='/' exact={true} component={CourseList}/>
          <Route path='/courses' exact={true} component={CourseList}/>
          <Route path='/course/:id/lessons' component={Attendance}/>
          <Route path='/course/:id' component={CourseEdit}/>
        </Switch>
      </Router>
    )
  }
}

export default App;