import React from 'react';
import { userContext } from '../login/UserContext';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Container, Table, ButtonGroup, Button, UncontrolledTooltip, Form } from 'reactstrap';
import AppSpinner from '../auxiliar/AppSpinner';
import AppNavbar from '../AppNavbar';
import DetailButton from '../buttons/DetailButton';
import ComponentWithErrorHandling from '../errorHandling/ComponentWithErrorHandling';
import AccessError from '../errorHandling/AccessError';
import * as SubjectAPI from '../services/SubjectAPI';
import * as UserAPI from '../services/UserAPI';
import * as Constants from '../auxiliar/Constants'

class AddCoordinatorsToSubject extends ComponentWithErrorHandling {

  emptyItem = {
    subjectCode: '',
    coordinators: []
  };

  constructor(props) {
    super(props);
    this.state = {
      subjectCoordinatorsIds: [], 
      allUsers: [],
      item: this.emptyItem,
      isLoading: true,
      currentUserId: ''};
    this.toggleAssignment = this.toggleAssignment.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    let item = {...this.state.item};
    item['subjectCode'] = this.props.match.params.id
    this.setState({isLoading: true, item: item});
    SubjectAPI.getSubjectCoordinatorsAsync(item.subjectCode, json => {
      this.setCoordinatorsAndIds(json)
    },
    this.showError("get coordinators"));
    UserAPI.getUsersAsync(json => {
      this.setState({allUsers: json, isLoading: false})
      },
      this.showError("get users"));
  }

  async handleSubmit(event) {
    event.preventDefault();
    // const {item} = this.state;
    let item = {...this.state.item};
    let coordinators = this.state.subjectCoordinatorsIds
    item['coordinators'] = coordinators
    this.setState({item: item})
    SubjectAPI.updateSubjectCoordinatorsAsync(item.subjectCode, 
      item.coordinators, 
      () => this.props.history.push(`/subject/${item.subjectCode}`), 
      this.showError("update coordinators"));
  }

  toggleAssignment(usUserId) {
    let subjectCoordinators = this.state.item.coordinators
    if (!subjectCoordinators.find(us => us.userId === usUserId)) {
      let userList = this.state.subjectCoordinatorsIds
      let user = {userId: usUserId}
      if (userList.find(us => us.userId === usUserId)) {
        const newUserList = userList.filter(us => us.userId !== usUserId)
        userList = newUserList
      }
      else { userList = userList.concat(user) }
      this.setState({subjectCoordinatorsIds: userList})
    }
  }

  // takes the list of users from api and sets the list of coordinators and coordinators Ids in state
  setCoordinatorsAndIds(coordinators) {
    let item = {...this.state.item};
    item['coordinators'] = coordinators;
    this.setState({item: item})

    let users4JSON = coordinators.map(coordinator => {
      return {userId: coordinator['userId']}
      })
    this.setState({subjectCoordinatorsIds: users4JSON})
  }

  render() {
    const {isLoading} = this.state;
    if (isLoading) { return <AppSpinner /> }
    const targetId = this.state.currentUserId;

    this.actualRol = this.context.actualRol;
    return (this.actualRol !== 'Cycle Coordinator' ?
      <AccessError errorCode="Only Cycle Coordinator are allowed" 
          errorDetail="Make sure you are signed in with valid role before try to access this page"/>
      : 
      <div>
        <AppNavbar>
          <Container fluid> 
            <Form onSubmit={this.handleSubmit}>
              <ButtonGroup className="float-right" inline="true">
                <Button size="sm" color="primary" type="submit" id='assignUserAsCoordinator'>
                  <UncontrolledTooltip placement="auto" target='assignUserAsCoordinator'>
                    Assign Selected Users as Coordinators
                  </UncontrolledTooltip>
                  <FontAwesomeIcon icon="save" size="2x"/>
                </Button>
                <DetailButton entityTypeCapName = {'Subject'} targetId = {targetId} to = {`/subject/${targetId}/detail`}/>
                <Button  size="sm" color="secondary" tag={Link} to={`/subject/${this.state.item.subjectCode}`} id="backToSubject">
                  <UncontrolledTooltip placement="auto" target="backToSubject">
                    Discard and Back to Subject
                  </UncontrolledTooltip>
                  <FontAwesomeIcon icon='backward' size="2x"/>
                </Button>
                </ButtonGroup>
            </Form>
            <h3>Add Coordinators to Subject</h3>
            <Table className="mt-4"> 
              <UserListHeaders />
              <tbody>
                <UserList
                  subjectCoordinatorsIds = {this.state.subjectCoordinatorsIds}
                  allUsers = {this.state.allUsers}
                  userOnClickFunction = {(userId) => {this.toggleAssignment(userId)}}
                  styleFunction = {(userId) => this.setRowColor(userId)}
                  setIconFunction = {(userId) => this.setRowIcon(userId)}
                  />
              </tbody>
            </Table>
          </Container>
        </AppNavbar>
      </div>
    );
  }
  
  setRowIcon(userId) {
    if (this.state.subjectCoordinatorsIds.find(us => us.userId === userId)) {
      return <FontAwesomeIcon icon='check' size="2x" color='#90EE90'/>
    }
    else { return <FontAwesomeIcon icon='times' size="2x" color='#CD5C5C' /> } 
  }
  
  setRowColor(rowId) {
    if (this.state.subjectCoordinatorsIds.find(us => us.userId === rowId)) {
      return {backgroundColor:'#F0FFF0'}
    }
    else { return {backgroundColor:'#FFF0F5'} }
  }
}

const th = Constants.tableHeader
const UserListHeaders = () =>
<thead>
    <tr>
      <th style={th}>DNI</th>
      <th style={th}>First Name</th>
      <th style={th}>Last Name</th>
      <th style={th}>e-Mail</th>
      <th style={th}>Dedication</th>
      <th style={th}>Selected</th>
  </tr>
</thead>;

const UserList = props => {
  return props.allUsers.map( (user, index) => {
    const userOnClickFunction = () => props.userOnClickFunction(user.userId);
    const setIconFunction = (userId) => props.setIconFunction(userId);
    return (
      <UserListItem
      key = {index}
      user = {user} 
      userOnClickFunction = {userOnClickFunction} 
      style = {props.styleFunction(user.userId)}
      setIconFunction = {setIconFunction}
      />
      )
    });
  }

const tr = Constants.tableRow
const UserListItem = props =>
<tr onClick={props.userOnClickFunction} id={props.user.userId} style={props.style}>
  <td style={tr}>{props.user.personalData.dni || ''}</td>
  <td style={tr}>{props.user.personalData.firstName || ''}</td>
  <td style={tr}>{props.user.personalData.lastName || ''}</td>
  <td style={tr}>{props.user.personalData.email || ''}</td>
  <td style={tr}>{props.user.jobDetail.dedication || ''}</td>
  <td style={{textAlign: 'center'}}> {props.setIconFunction(props.user.userId)}</td>
</tr>;

AddCoordinatorsToSubject.contextType = userContext;
export default AddCoordinatorsToSubject;