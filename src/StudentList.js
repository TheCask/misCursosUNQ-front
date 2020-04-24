import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';

class StudentList extends Component {

  constructor(props) {
    super(props);
    this.state = {students: [] , isLoading: true};
    this.remove = this.remove.bind(this);
  }

  async componentDidMount() {
    this.setState({isLoading: true});
    fetch(`/api/course/${this.props.match.params.id}/students`)
        .then(response => response.json())
        .then(data => this.setState({students: data, courseId: this.props.match.params.id, isLoading: false}));
  }

  async remove(id) {
    await fetch(`/api/student/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updatedStudents = [...this.state.students].filter(i => i.fileNumber !== id);
      this.setState({students: updatedStudents});
    });
  }

  render() {
    const {students, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const studentList = students.map(student => {
      return <tr key={student.fileNumber}>
        <td style={{whiteSpace: 'nowrap'}}>{student.fileNumber || ''}</td>
        <td style={{whiteSpace: 'nowrap'}}>{student.personalData.firstName || ''}</td>
        <td style={{whiteSpace: 'nowrap'}}>{student.personalData.lastName || ''}</td>
        <td>
          <ButtonGroup>
            <Button size="sm" color="primary" tag={Link} to={"/student/" + student.fileNumber}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(student.fileNumber)}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    });

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <ButtonGroup>
                <Button color="success" tag={Link} to="/student/new">Add Student</Button>
                <Button color="secondary" tag={Link} to="/courses">Back To Courses</Button>
            </ButtonGroup>
          </div>
          <h3>Students</h3>
          <Table className="mt-4">
            <thead>
            <tr>
              <th width="10%">File Number</th>
              <th width="15%">First Name</th>
              <th width="15%">Last Name</th>
              <th width="15%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {studentList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default StudentList;