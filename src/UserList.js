import React, { Component } from 'react';
import { Container, Table} from 'reactstrap';
import AppSpinner from './AppSpinner';
import AppNavbar from './AppNavbar';
import ButtonBar from './buttonBar/ButtonBar';
import * as UserAPI from './services/UserAPI';
import ComponentWithErrorHandling from './errorHandling/ComponentWithErrorHandling'

class FullUserList extends ComponentWithErrorHandling {
  render() {
    return(
      <AppNavbar>
        {this.renderErrorModal()}
        <UserListContainer 
          userListTitle = {'Users'}
          onGetAll = { (handleSuccess, handleError) => UserAPI.getUsersAsync(handleSuccess, handleError) }
          onDelete = { (userId, handleSuccess, handleError) => UserAPI.deleteUserAsync(userId, handleSuccess, handleError)}
          onDeleteConsequenceList = {[
            "The user will no longer be available.",
            "If the user has taught courses or coordinated subjects, deleting is not allowed.",
            "Please remove courses or subjects from user before trying to delete."
          ]}
          addButtonTo = {`/user/new`}
          deleteButtonTo = {'/users'}
          entityType = 'user'
          applyDisallowDeleteFunction = { true }
        />
      </AppNavbar>
    )
  }
}

export class UserListContainer extends ComponentWithErrorHandling {

  constructor(props) {
    super(props);
    this.state = {...this.state, ...{
      users: [], isLoading: true, targetId: ''}};
    this.title = this.props.userListTitle;
    this.addButtonTo = props.addButtonTo;
    this.deleteButtonTo = props.deleteButtonTo;
    this.entityType = props.entityType;
    this.contextParams = props;
    this.disallowDelete = props.disallowDelete;
    this.applyDisallowDeleteFunction = props.applyDisallowDeleteFunction;
  }

  componentDidMount() {
    this.setState({isLoading: true});
    this.contextParams.onGetAll(json => this.setState({users: json, isLoading: false}, this.showError("get users' info") )); // TODO: replace null by error showing code
  }

  remove(userId) {
    this.contextParams.onDelete(
      userId, 
      () => {
        let updatedUsers = [...this.state.users].filter(user => user.userId !== userId);
        this.setState({users: updatedUsers, targetId: ''});
      },
      this.showError("remove user")
    );
  }

  disallowsDelete(userId) {
    const targetUser = this.state.users.find(user => user.userId === userId)
    if (targetUser && (targetUser.taughtCourses.length > 0 || targetUser.coordinatedSubjects.length > 0)) {
      return true
    }
    return false
  }

  setSelectedRowColor(rowId) {
    if (rowId === this.state.targetId) {
      return {backgroundColor:'#F0F8FF'}
    }
  }

  render() {
    const isLoading = this.state.isLoading;
    if (isLoading) { return (<AppSpinner/>) }
    const deleteUserFunction = () => {this.remove(this.state.targetId)};
    return (
      <div>
        <Container fluid>     
          <ButtonBar 
            entityType = {this.entityType}
            targetId = {this.state.targetId} 
            deleteEntityFunction = {deleteUserFunction}
            disallowDelete = {this.applyDisallowDeleteFunction ? this.disallowsDelete(this.state.targetId) : false }
            consequenceList = {this.contextParams.onDeleteConsequenceList}
            addButtonTo = {this.addButtonTo}
            deleteButtonTo = {this.deleteButtonTo}
          />
          <h3>{this.title}</h3>
          <Table hover className="mt-4"> 
            <UserListHeaders/>
            <tbody>
              <UserList 
                users = {this.state.users}
                userOnClickFunction = {(userId) =>  {this.setState({targetId: userId})}}
                styleFunction = {(userId) => this.setSelectedRowColor(userId)} 
              />
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

const UserListHeaders = () =>
<thead>
    <tr>
      <th width="3%">DNI</th>
      <th width="7%">First Name</th>
      <th width="7%">Last Name</th>
      <th width="7%">e-Mail</th>
      <th width="4%">Cell Phone</th>
      <th width="2%">Dedication</th>
      <th width="1%">Aditional Hours</th>
  </tr>
</thead>;

const UserList = props => {
  return props.users.map( (user, index) => {
    const userOnClickFunction = () => props.userOnClickFunction(user.userId);
    return (
      <UserListItem
        key = {index}
        user = {user} 
        userOnClickFunction = {userOnClickFunction} 
        style = {props.styleFunction(user.userId)}
      />
    )
  });
}

const UserListItem = props =>
  <tr onClick={props.userOnClickFunction} id={props.user.userId} style={props.style} key={props.user.userId}>
    <td style={{whiteSpace: 'nowrap'}}>{props.user.personalData.dni || ''}</td>
    <td style={{whiteSpace: 'nowrap'}}>{props.user.personalData.firstName || ''}</td>
    <td style={{whiteSpace: 'nowrap'}}>{props.user.personalData.lastName || ''}</td>
    <td style={{whiteSpace: 'nowrap'}}>{props.user.personalData.email || ''}</td>
    <td style={{whiteSpace: 'nowrap'}}>{props.user.personalData.cellPhone || ''}</td>
    <td style={{whiteSpace: 'nowrap'}}>{props.user.jobDetail.dedication || ''}</td>
    <td style={{whiteSpace: 'nowrap'}}>{props.user.jobDetail.aditionalHours || ''}</td>
  </tr>;

export default FullUserList;