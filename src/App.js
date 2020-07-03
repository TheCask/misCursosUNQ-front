import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import {userContext} from './login/UserContext';
// LOCAL
import './App.css';
import Home from './Home';
import FullCourseList from './course/CourseList';
import CourseEdit from './course/CourseEdit';
import AddStudentsToCourse from './course/AddStudentsToCourse';
import AddTeachersToCourse from './course/AddTeachersToCourse';
import AddCoordinatorsToSubject from './subject/AddCoordinatorsToSubject'
import Attendance from './course/Attendance';
import FullStudentList from './student/StudentList';
import StudentEdit from './student/StudentEdit';
import FullSubjectList from './subject/SubjectList';
import SubjectEdit from './subject/SubjectEdit';
import FullUserList from './user/UserList';
import UserEdit from './user/UserEdit';
import CsvUsersImport from './user/CsvUsersImport'
import * as Detail from './auxiliar/Details'
import Profile from './login/Profile';
import * as AuthAPI from './services/AuthAPI';
import AppSpinner from './auxiliar/AppSpinner';
//import EvaluationPage from './evaluations/Evaluation';
import EvaluationPage from './evaluations/EvaluationPage';
import EXPERIMENTING from './experimental/EXPERIMENTING';
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
    
    const rehydrate = localStorage.getItem('rol') || 'Guest';
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
            <Route path='/courses' component={FullCourseList}/>
            <Route path='/course/:id/lessons' component={Attendance}/>
            <Route path='/course/:id/addStudents' component={AddStudentsToCourse}/>
            <Route path='/course/:id/addTeachers' component={AddTeachersToCourse}/>
            <Route path='/course/:id/evaluations' component={EvaluationPage}/>
            <Route path='/course/:id' exact={true} component={CourseEdit}/>
            <Route path='/course/:id/detail' component={Detail.CourseDetail}/>
            <Route path='/students' component={FullStudentList}/>
            <Route path='/student/:id' exact={true} component={StudentEdit}/>
            <Route path='/student/:id/detail' component={Detail.StudentDetail}/>
            <Route path='/subjects' component={FullSubjectList}/>
            <Route path='/subject/:id/addCoordinators' component={AddCoordinatorsToSubject}/>
            <Route path='/subject/:id' exact={true} component={SubjectEdit}/>
            <Route path='/subject/:id/detail' component={Detail.SubjectDetail}/>
            <Route path='/users/importFromCsv' exact={true} component={CsvUsersImport}/>
            <Route path='/users' component={FullUserList}/>
            <Route path='/profile' component={Profile}/>
            <Route path='/user/:id' exact={true} component={UserEdit}/>
            <Route path='/user/:id/detail' component={Detail.UserDetail}/>
            <Route path='/experimenting' component={EXPERIMENTING}/>
  {/*           <Route path='/evaluation' component={EvaluationPage}/> */}

          </Switch>
        </Router>
      </userContext.Provider>
    )
  }
}

export default App;