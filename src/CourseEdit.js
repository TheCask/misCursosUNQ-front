import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, Spinner } from 'reactstrap';
import AppNavbar from './AppNavbar';

class CourseEdit extends Component {

    emptyItem = {
        courseName: '',
        courseCode: '',
        courseShift: '',
        courseIsOpen: '',
        students: '',
        lessons: '',
    };

  constructor(props) {
    super(props);
    this.state = {
      item: this.emptyItem
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    if (this.props.match.params.id !== 'new') {
      const course = await (await fetch(`/courses/${this.props.match.params.id}`)).json();
      this.setState({item: course});
    }
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    let item = {...this.state.item};
    item[name] = value;
    this.setState({item});
  }

  async handleSubmit(event) {
    event.preventDefault();
    const {item} = this.state;

    await fetch('/courses', {
      method: (item.id) ? 'PUT' : 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item),
    });
    this.props.history.push('/courses');
  }

  render() {
    const {item} = this.state;
    const title = <h2>{item.id ? 'Edit Course' : 'Add Course'}</h2>;

    return <div>
      <AppNavbar/>
      <Container>
        {title}
        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label for="name">Name</Label>
            <Input type="text" name="name" id="name" value={item.courseName || ''}
                   onChange={this.handleChange} autoComplete="Course Name"/>
          </FormGroup>
          <FormGroup>
            <Label for="code">Code</Label>
            <Input type="text" name="code" id="code" value={item.courseCode || ''}
                   onChange={this.handleChange} autoComplete="Course Code"/>
          </FormGroup>
          <FormGroup>
            <Label for="shift">Shift</Label>
            <Input type="select" name="shift" id="shift" value={item.courseShift || ''}
                    onChange={this.handleChange} autoComplete="Course Shift">
                <option>Mañana</option>
                <option>Tarde</option>
                <option>Noche</option>
            </Input>
          </FormGroup>
          <FormGroup check>
            <Label check for="isOpen">
                <Input type="checkbox" name="isOpen" id="isOpen" chequed={item.courseIsOpen}
                   onChange={this.handleChange} />
                isOpen       
            </Label>
          </FormGroup>
          <FormGroup>
            <Button color="primary" type="submit">Save</Button>{' '}
            <Button color="secondary" tag={Link} to="/courses">Cancel</Button>
          </FormGroup>
        </Form>
      </Container>
    </div>
  }
}

export default withRouter(CourseEdit);