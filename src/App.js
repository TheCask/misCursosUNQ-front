import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import {userContext} from './login/UserContext';
// LOCAL
import './App.css';
import Home from './Home';
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
import * as Detail from './Details'
import SetUser from './login/SetUser';
import * as AuthAPI from './services/AuthAPI';
import AppSpinner from './AppSpinner';
//import EvaluationPage from './Evaluation';
import EXPERIMENTING from './EXPERIMENTING';
// FONT AWESOME
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faCheckSquare, faCoffee } from '@fortawesome/free-solid-svg-icons'
import ComponentWithErrorHandling from './errorHandling/ComponentWithErrorHandling';

library.add(fab, fas, faCheckSquare, faCoffee)

class App extends ComponentWithErrorHandling {

  constructor(props) {
    super(props);
    this.state = {isErrorModalOpen: true, 
      lastError: {title: "", description: "", error: null},
      globalUser: {}, appUser: {}, actualRol: 'Guest', isLoadingG: true, isLoadingA: true};
  };

  async componentDidMount() {
    AuthAPI.getGlobalUserByIdAsync(json => this.setState({globalUser: json, isLoadingG: false}), 
      this.showError("get global user"));
    AuthAPI.getAppUserByIdAsync(json => this.setState({appUser: json, isLoadingA: false}), 
      this.showError("get app user"));
    
    const rehydrate = localStorage.getItem('rol') || '';
    this.setState({actualRol: rehydrate});
  }

  chooseRol(rol) {
    this.setState({actualRol: rol});
    localStorage.setItem('rol', rol);
  }

  render() {
    if (this.state.isLoadingG || this.state.isLoadingA) { return (<AppSpinner/>) }
    const value = {
      globalUser: this.state.globalUser.user,
      appUser: this.state.appUser.registration,
      actualRol: this.state.actualRol,
      chooseRol: rol => this.chooseRol(rol)
    }

    return (
      <userContext.Provider value={value}>
        <Router>
          <Switch>
            <Route path='/' exact={true} component={Home}/>
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
            <Route path='/profile' exact={true} component={SetUser}/>
            <Route path='/user/:id' exact={true} component={UserEdit}/>
            <Route path='/user/:id/detail' exact={true} component={Detail.UserDetail}/>
            <Route path='/experimenting' component={EXPERIMENTING}/>
  {/*           <Route path='/evaluation' component={EvaluationPage}/> */}

          </Switch>
        </Router>
      </userContext.Provider>
    )
  }
}

export default App;