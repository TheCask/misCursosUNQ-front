import React, { Component } from 'react';
import { Container, Table} from 'reactstrap';
import AppSpinner from './AppSpinner';
import AppNavbar from './AppNavbar';
import ButtonBar from './buttonBar/ButtonBar';
import * as BackAPI from './BackAPI';
import Log from './Log';

class FullUserList extends Component {

  render() {
    return(
    <div>
      <AppNavbar/>
      <UserListContainer 
        userListTitle = {'Users'}
        onGetAll = { (handleSuccess, handleError) => BackAPI.getUsersAsync(handleSuccess, handleError) }
        onDelete = { (userId, handleSuccess, handleError) => BackAPI.deleteUserAsync(userId, handleSuccess, handleError)}
        onDeleteConsequenceList = {[
          "The user will no longer be available.",
          "If the user has taught courses or coordinated subjects, deleting is not allowed.",
          "Please remove courses or subjects from user before trying to delete."
        ]}
      />
    </div>
    )
  }
}

export class UserListContainer extends Component {

  constructor(props) {
    super(props);
    this.title = this.props.userListTitle;
    this.state = {users: [], isLoading: true, targetId: ''};
    this.contextParams = props;
  }

  componentDidMount() {
    this.setState({isLoading: true});
    this.contextParams.onGetAll(json => this.setState({users: json, isLoading: false}, null )); // TODO: replace null by error showing code
  }

  remove(userId) {
    this.contextParams.onDelete(
      userId, 
      () => {
        let updatedUsers = [...this.state.users].filter(user => user.userId !== userId);
        this.setState({users: updatedUsers, targetId: ''});
      },
      null // TODO: replace null by error showing code
    );
  }

  disallowsDelete(userId) {
    const targetUser = this.state.users.find(user => user.userId === userId)
    if (targetUser) {
      return (targetUser.taughtCourses.length > 0 || 
        targetUser.taughtCourses.length > 0) 
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
            entityType = 'user' 
            targetId = {this.state.targetId} 
            deleteEntityFunction = {deleteUserFunction}
            disallowDelete = {this.disallowsDelete(this.state.targetId)}
            consequenceList = {this.contextParams.onDeleteConsequenceList} />  
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
      <th width="7%" >First Name</th>
      <th width="7%" >Last Name</th>
      <th width="7%" >e-Mail</th>
      <th width="4%" >Cell Phone</th>
      <th width="2%" >Dedication</th>
      <th width="1%" >Aditional Hours</th>
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
