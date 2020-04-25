import React, { Component } from 'react';
import './App.css';
import Home from './Home';
import CourseList from './CourseList';
import Attendance from './Attendance';
import CourseEdit from './CourseEdit';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

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