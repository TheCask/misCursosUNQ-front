import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Container, Form, FormGroup, Input, ButtonGroup } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { UserListContainer } from './UserList'
import SaveButton from './buttonBar/SaveButton'
import CancelButton from './buttonBar/CancelButton'
import * as SubjectAPI from './services/SubjectAPI';
import ComponentWithErrorHandling from './errorHandling/ComponentWithErrorHandling'


class SubjectEdit extends ComponentWithErrorHandling {

  emptyItem = {
    code: '',
    name: '',
    acronym: '',
    programURL: ''
  };

  constructor(props) {
    super(props);
    this.state = {...this.state, ...{
      item: this.emptyItem,
    }};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    if (this.props.match.params.id !== 'new') {
      SubjectAPI.getSubjectByIdAsync(this.props.match.params.id, subject => this.setState({item: subject}), this.showError("get subject"));
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
    SubjectAPI.postSubjectAsync(item, () => this.props.history.push('/subjects'), this.showError("save subject"));
  }

  render() {
    const {item} = this.state;
    let newSubject = this.props.match.params.id === 'new'
    const title = <h2 className="float-left">{!newSubject ? 'Edit Subject' : 'Add Subject'}</h2>;
    return (
      <AppNavbar>
        {this.renderErrorModal()}
        <Container fluid>
          <Form onSubmit={this.handleSubmit}>
            {title}
            <FormGroup className="float-right">
              <ButtonGroup>
                <SaveButton
                  entityId = {item.code}
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
          {this.renderUsers()}
        </Container>
      </AppNavbar>
    )};

  renderUsers() {
    const subjectId = this.props.match.params.id;
    if (subjectId !== 'new') {
      return (
        <UserListContainer 
          userListTitle = {'Subject Coordinators'}
          onGetAll = { (handleSuccess, handleError) => SubjectAPI.getSubjectCoordinatorsAsync(subjectId, handleSuccess, handleError) }
          onDelete = { (userId, handleSuccess, handleError) => SubjectAPI.deleteSubjectCoordinatorAsync(userId, subjectId, handleSuccess, handleError)}
          onDeleteConsequenceList = {[
            "The user will no longer be coordinator of this subject."
          ]}
          addButtonTo = {`/subject/${subjectId}/addCoordinators`}
          entityType = 'coordinator'
        />
      );
    }
  }
}

export default withRouter(SubjectEdit);