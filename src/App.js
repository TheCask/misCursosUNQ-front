import React, { Component } from 'react';
import './App.css';
import Home from './Home';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import CourseList from './CourseList';
import logo from './logo.svg';

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path='/' exact={true} component={Home}/>
          <Route path='/courses' exact={true} component={CourseList}/>
        </Switch>
      </Router>
    )
  }
}

export default App;