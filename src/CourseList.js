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

    fetch('courses')
      .then(response => response.json())
      .then(data => this.setState({courses: data, isLoading: false}));
  }

  async remove(id) {
    await fetch(`/course/${id}`, {
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
      const courseData = `${course.courseName || ''} ${course.courseCode || ''} ${course.courseShift || ''}`;
      return <tr key={course.courseId}>
        <td style={{whiteSpace: 'nowrap'}}>{course.courseName}</td>
        <td>{courseData}</td>
        <td>
          <ButtonGroup>
            <Button size="sm" color="primary" tag={Link} to={"/courses/" + course.courseId}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(course.courseId)}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    });

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to="/courses/new">Add Course</Button>
          </div>
          <h3>Mis Cursos UNQ</h3>
          <Table className="mt-4">
            <thead>
            <tr>
              <th width="20%">Name</th>
              <th width="20%">Data</th>
              <th width="10%">Actions</th>
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
}

export default CourseList;