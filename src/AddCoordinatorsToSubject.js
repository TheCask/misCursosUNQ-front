import React, { Component } from 'react';
import { Container, Table, ButtonGroup, Button, UncontrolledTooltip, Form } from 'reactstrap';
import AppSpinner from './AppSpinner';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import DetailButton from './buttonBar/DetailButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as SubjectAPI from './services/SubjectAPI';
import * as UserAPI from './services/UserAPI';

class AddCoordinatorsToSubject extends Component {

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
    null); // TODO: replace null by error showing code
    UserAPI.getUsersAsync(json => {
      this.setState({allUsers: json, isLoading: false})
      },
      null); // TODO: replace null by error showing code
  }

  async handleSubmit(event) {
    event.preventDefault();
    // const {item} = this.state;
    let item = {...this.state.item};
    let coordinators = this.state.subjectCoordinatorsIds
    item['coordinators'] = coordinators
    this.setState({item: item})
    SubjectAPI.updateSubjectCoordinatorsAsync(item.subjectCode, item.coordinators, () => this.props.history.push('/subjects'), null); // TODO: replace null by error showing code
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
    const targetId = this.state.currentUserId
    return (
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
                <Button  size="sm" color="secondary" tag={Link} to="/subjects" id="backToSubject">
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

const UserListHeaders = () =>
<thead>
    <tr>
      <th width="3%">DNI</th>
      <th width="7%" >First Name</th>
      <th width="7%" >Last Name</th>
      <th width="7%" >e-Mail</th>
      <th width="4%" >Cell Phone</th>
      <th width="2%" >Dedication</th>
      <th width="1%" >Aditional Hours</th>
      <th width="3%">Selected</th>
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

const UserListItem = props =>
  <tr onClick={props.userOnClickFunction} id={props.user.userId} style={props.style}>
    <td style={{whiteSpace: 'nowrap'}}>{props.user.personalData.dni || ''}</td>
    <td style={{whiteSpace: 'nowrap'}}>{props.user.personalData.firstName || ''}</td>
    <td style={{whiteSpace: 'nowrap'}}>{props.user.personalData.lastName || ''}</td>
    <td style={{whiteSpace: 'nowrap'}}>{props.user.personalData.email || ''}</td>
    <td style={{whiteSpace: 'nowrap'}}>{props.user.personalData.cellPhone || ''}</td>
    <td style={{whiteSpace: 'nowrap'}}>{props.user.jobDetail.dedication || ''}</td>
    <td style={{whiteSpace: 'nowrap'}}>{props.user.jobDetail.aditionalHours || ''}</td>
    <td style={{textAlign: 'center'}}> {props.setIconFunction(props.user.userId)}</td>
  </tr>;

export default AddCoordinatorsToSubject;