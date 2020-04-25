import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';

class CourseList extends Component {

  constructor(props) {
    super(props);
    this.state = {courses: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    fetch('/api/courses')
      .then(response => response.json())
      .then(data => this.setState({courses: data, isLoading: false}));
  }

  async remove(id) {
    await fetch(`/api/course/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updatedCourses = [...this.state.courses].filter(i => i.courseId !== id);
      this.setState({courses: updatedCourses});
    });
  }

  render() {
    const {courses, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const courseList = courses.map(course => {
      return <tr key={course.courseId}>
        <td style={{whiteSpace: 'nowrap'}}>{course.courseName || ''}</td>
        <td style={{whiteSpace: 'nowrap'}}>{course.courseCode || ''}</td>
        <td style={{whiteSpace: 'nowrap'}}>{course.courseShift || ''}</td>
        <td style={{whiteSpace: 'nowrap'}}>{this.formatYESoNO(course.courseIsOpen) || ''}</td>
        <td style={{whiteSpace: 'nowrap'}}>{course.students.length || ''}</td>
        <td style={{whiteSpace: 'nowrap'}}>{course.lessons.length || ''}</td>
        <td>
          <ButtonGroup inline>
            <Button size="sm" color="primary" tag={Link} to={"/course/" + course.courseId}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(course.courseId)}>Delete</Button>
            <Button size="sm" color="success" tag={Link} to={`/course/${course.courseId}/lessons`}>Take Attendance</Button>
          </ButtonGroup>
        </td>
      </tr>
    });

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to="/course/new">Add Course</Button>
          </div>
          <h3>Courses</h3>
          <Table className="mt-4">
            <thead>
            <tr>
              <th width="10%">Name</th>
              <th width="15%">Code</th>
              <th width="5%">Shift</th>
              <th width="5%">Open</th>
              <th width="1%">Students</th>
              <th width="1%">Lessons</th>
              <th width="5%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {courseList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }

  formatYESoNO(value) {
    return value===false ? 'No' : 'Yes';
  }
}

export default CourseList;