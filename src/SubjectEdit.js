import React from 'react'; //{Component}
import { withRouter } from 'react-router-dom';
import { Container, Form, FormGroup, Input, ButtonGroup, Row, Col, Label } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { UserListContainer } from './UserList'
import SaveButton from './buttonBar/SaveButton'
import CancelButton from './buttonBar/CancelButton'
import * as SubjectAPI from './services/SubjectAPI';
import ComponentWithErrorHandling from './errorHandling/ComponentWithErrorHandling'
import { userContext } from './login/UserContext';


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
    this.onlyDetail = props.onlyDetail || false;
  }

  async componentDidMount() {
    if (this.props.match.params.id !== 'new') {
      SubjectAPI.getSubjectByIdAsync(this.props.match.params.id, 
        subject => this.setState({item: subject}), 
        this.showError("get subject"));
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
    SubjectAPI.postSubjectAsync(item, 
      () => this.props.history.push('/subjects'), 
      this.showError("save subject"));
  }

  chooseTitle(onlyDetail, newSubject) {
    let title = ''
    if (onlyDetail) { title = 'Subject Details' }
    else if (newSubject) { title = 'Add Subject'}
    else { title = 'Edit Subject'}
    return <h2 className="float-left">{title}</h2>;
  }

  render() {
    const {item} = this.state;
    let newSubject = this.props.match.params.id === 'new';
    let onlyDetail = this.onlyDetail;
    let title = this.chooseTitle(onlyDetail, newSubject);
    let actualRol = this.context.actualRol;
    return (
      <AppNavbar>
        {this.renderErrorModal()}
        <Container fluid>
          <Form onSubmit={this.handleSubmit}>
          <Row xs="2">
            <Col>{title}</Col>
            <Col>
              <ButtonGroup className="float-right">
                <SaveButton entityId = {item.code} entityTypeCapName = "Subject" disabled={onlyDetail || actualRol !== 'Cycle Coordinator'}/>
                {' '}
                <CancelButton onClick={() => this.props.history.goBack()} />
              </ButtonGroup>
           </Col>
          </Row>
          <Row form>
            <Col xs='3'>
              <FormGroup>
                <Label for="code">Subject Code</Label>
                <Input type="text" name="code" id="code" value={item.code || ''} required
                      onChange={this.handleChange} placeholder="Subject Code" disabled={!newSubject || onlyDetail}/>
              </FormGroup>
            </Col>
          </Row>
          <Row form>
            <Col xs='6'>
            <FormGroup>
              <Label for="name">Subject Name</Label>
              <Input type="text" name="name" id="name" value={item.name || ''} required
                    onChange={this.handleChange} placeholder="Subject Name" disabled={onlyDetail}/>
            </FormGroup>
            </Col>
            <Col xs='2'>
              <FormGroup>
                <Label for="acronym">Acronym</Label>
                <Input type="text" name="acronym" id="acronym" value={item.acronym || ''} required
                      onChange={this.handleChange} placeholder="Subject Acronym" disabled={onlyDetail}/>
              </FormGroup>
            </Col>
          </Row>
          <Row form>
            <Col xs='6'>
              <FormGroup>
                <Label for="programURL">Program Link</Label>
                <Input type="url" name="programURL" id="programURL" value={item.programURL || ''}
                  onChange={this.handleChange} placeholder="URL to Subject's Program" disabled={onlyDetail}/>
              </FormGroup>
            </Col>
          </Row>
          </Form>
          {this.renderUsers(onlyDetail, actualRol)}
        </Container>
      </AppNavbar>
    )};

  renderUsers(onlyDetail, actualRol) {
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
          renderButtonBar = {!onlyDetail}
          renderAddButton = {actualRol === 'Cycle Coordinator'}
          renderDeleteButton = {actualRol === 'Cycle Coordinator'}
          renderEditButton= {false}
        />
      );
    }
  }
}
SubjectEdit.contextType = userContext;
export default withRouter(SubjectEdit);