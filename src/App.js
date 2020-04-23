import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = {
    isLoading: true,
    courses: []
  };

  async componentDidMount() {
    const response = await fetch('/courses');
    const body = await response.json();
    this.setState({ courses: body, isLoading: false });
  }

  render() {
    const {courses, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <div className="App-intro">
            <h2>Courses List</h2>
            {courses.map(course =>
              <div key={course.courseId}>
                {course.courseName}
              </div>
            )}
          </div>
        </header>
      </div>
    );
  }
}

export default App;