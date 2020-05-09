import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Container, Form, FormGroup, Input, Label, ButtonGroup, UncontrolledTooltip } from 'reactstrap';
import AppNavbar from './AppNavbar';
import Log from './Log';

class SubjectEdit extends Component {

  emptyItem = {
    code: '',
    name: '',
    acronym: [],
    programURL: []
  };

  constructor(props) {
    super(props);
    this.state = {
      item: this.emptyItem,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    if (this.props.match.params.id !== 'new') {
      const subject = await (await fetch(`/api/subject/${this.props.match.params.id}`)).json();
      this.setState({item: subject});
    }
  }

  handleChange(event) {
    const {name, value} = event.target;
    this.state.item[name] = value;
    this.setState({item: this.state.item});
  }

  async handleSubmit(event) {
    event.preventDefault();
    const {item} = this.state;
    await fetch('/api/subject', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item),
    });
    this.props.history.push('/subjects');
  }

  render() {
    const {item} = this.state;
    let newSubject = this.props.match.params.id === 'new'
    const title = <h2 className="float-left">{!newSubject ? 'Edit Subject' : 'Add Subject'}</h2>;
    return <div>
      <AppNavbar/>
      <Container fluid>
        <Form onSubmit={this.handleSubmit}>
        {title}
        <FormGroup className="float-right">
          <ButtonGroup inline="true">
            <Button size="sm" color="primary" type="submit" id="editSubject">
              <UncontrolledTooltip placement="auto" target="editSubject">
                {item.fileNumber ? 'Save Changes' : 'Save New Subject'}
              </UncontrolledTooltip>
              <FontAwesomeIcon icon={['fas', 'save']} size="2x"/>
            </Button>{' '}
            <Button size="sm" color="secondary" tag={Link} to="/subjects" id="backToSubjects">
              <UncontrolledTooltip placement="auto" target="backToSubjects">
                Discard and Back to Subject
              </UncontrolledTooltip>
              <FontAwesomeIcon icon={['fas', 'backward']} size="2x"/>
            </Button>
          </ButtonGroup>
        </FormGroup>
          <FormGroup>
            <Input type="text" name="code" id="code" value={item.code || ''}
                   onChange={this.handleChange} placeholder="Subject Code" disabled={!newSubject}/>
          </FormGroup>
          <FormGroup>
            <Input type="text" name="name" id="name" value={item.name || ''}
                   onChange={this.handleChange} placeholder="Subject Name"/>
          </FormGroup>
          <FormGroup>
            <Input type="text" name="acronym" id="acronym" value={item.acronym || ''}
                   onChange={this.handleChange} placeholder="Subject Acronym"/>
          </FormGroup>
          <FormGroup>
            <Input type="text" name="programURL" id="programURL" value={item.programURL || ''}
                   onChange={this.handleChange} placeholder="URL to Subject's Program"/>
          </FormGroup>
        </Form>
      </Container>
    </div>
  }
}

export default withRouter(SubjectEdit);