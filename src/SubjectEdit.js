import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Container, Form, FormGroup, Input, ButtonGroup } from 'reactstrap';
import AppNavbar from './AppNavbar';
import SaveButton from './buttonBar/SaveButton'
import CancelButton from './buttonBar/CancelButton'
import * as SubjectAPI from './services/SubjectAPI';

class SubjectEdit extends Component {

  emptyItem = {
    code: '',
    name: '',
    acronym: '',
    programURL: ''
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
      SubjectAPI.getSubjectByIdAsync(this.props.match.params.id, subject => this.setState({item: subject}), null) // TODO: replace null by error showing code
    }
  }

  handleChange(event) {
    const {name, value} = event.target;
    let item = {...this.state.item};
    item[name] = value;
    this.setState({item});
  }


  async handleSubmit(event) {
    event.preventDefault();
    const {item} = this.state;
    SubjectAPI.postSubjectAsync(item, () => this.props.history.push('/subjects'), null); // TODO: replace null by error showing code
  }

  render() {
    const {item} = this.state;
    let newSubject = this.props.match.params.id === 'new'
    const title = <h2 className="float-left">{!newSubject ? 'Edit Subject' : 'Add Subject'}</h2>;
    return <div>
      <AppNavbar>

        <Container fluid>
          <Form onSubmit={this.handleSubmit}>
            {title}
            <FormGroup className="float-right">
              <ButtonGroup>
                <SaveButton
                  entityId = {item.fileNumber}
                  entityTypeCapName = "Subject"
                />
                {' '}
                <CancelButton
                  to = {"/subjects"}
                  entityTypeCapName = "Subject"
                />
              </ButtonGroup>
            </FormGroup>
            <FormGroup>
              <Input type="text" name="code" id="code" value={item.code || ''} required
                    onChange={this.handleChange} placeholder="Subject Code" disabled={!newSubject}/>
            </FormGroup>
            <FormGroup>
              <Input type="text" name="name" id="name" value={item.name || ''} required
                    onChange={this.handleChange} placeholder="Subject Name"/>
            </FormGroup>
            <FormGroup>
              <Input type="text" name="acronym" id="acronym" value={item.acronym || ''} required
                    onChange={this.handleChange} placeholder="Subject Acronym"/>
            </FormGroup>
            <FormGroup>
              <Input type="url" name="programURL" id="programURL" value={item.programURL || ''}
                onChange={this.handleChange} placeholder="URL to Subject's Program"/>
            </FormGroup>
          </Form>
        </Container>
      </AppNavbar>
    </div>
  }
}

export default withRouter(SubjectEdit);