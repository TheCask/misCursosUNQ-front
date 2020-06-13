import React from 'react'; //{Component}
import {Container, Table, InputGroup, Button, Input, 
  InputGroupAddon, Col, Row, UncontrolledTooltip} from 'reactstrap';
import AppSpinner from './AppSpinner';
import AppNavbar from './AppNavbar';
import ButtonBar from './buttonBar/ButtonBar';
import * as UserAPI from './services/UserAPI';
import ComponentWithErrorHandling from './errorHandling/ComponentWithErrorHandling'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

class FullUserList extends ComponentWithErrorHandling {
  render() {
    return(
      <AppNavbar>
        {this.renderErrorModal()}
        <UserListContainer 
          userListTitle = {'Users'}
          onGetAll = {(handleSuccess, handleError) => UserAPI.getUsersAsync(handleSuccess, handleError)}
          onDelete = {(userId, handleSuccess, handleError) => UserAPI.deleteUserAsync(userId, handleSuccess, handleError)}
          onSearch = {(page, text, handleSuccess, handleError) => UserAPI.searchUsersAsync(page, text, handleSuccess, handleError)}
          renderSearch = {true}
          addButtonTo = {'/user/new'}
          deleteButtonTo = {'/users'}
          entityType = 'user'
          applyDisallowDeleteFunction = {true}
          onDeleteConsequenceList = {[ "The user will no longer be available." ]}
          onDisableDeleteTitle = {"Forbidden delete of User"}
          onDisableDeleteBody = {
            <div>
            <h3>This action is forbidden: </h3>
            <ul><li>The user has taught courses or coordinated subjects, deleting is not allowed.</li>
            <li>Please remove courses or subjects from user before trying to delete.</li></ul>
            </div>
         }
        />
      </AppNavbar>
    )
  }
}

export class UserListContainer extends ComponentWithErrorHandling {

  constructor(props) {
    super(props);
    this.state = {...this.state, ...{
      users: [], isLoading: true, targetId: '', searchText: '', pageNo: 1}};
    this.title = this.props.userListTitle;
    this.addButtonTo = props.addButtonTo;
    this.deleteButtonTo = props.deleteButtonTo;
    this.entityType = props.entityType;
    this.contextParams = props;
    this.disallowDelete = props.disallowDelete;
    this.applyDisallowDeleteFunction = props.applyDisallowDeleteFunction;
    this.onDisableDeleteTitle = props.onDisableDeleteTitle;
    this.onDisableDeleteBody = props.onDisableDeleteBody;
    this.renderSearch = props.renderSearch
    this.handleChange = this.handleChange.bind(this)
    this.doSearch = this.doSearch.bind(this)
 }

  componentDidMount() {
    this.setState({isLoading: true});
    this.contextParams.onGetAll(json => this.setState({users: json, isLoading: false}), 
      this.showError("get users info"));
 }

  remove(userId) {
    this.contextParams.onDelete(
      userId, 
      () => {
        let updatedUsers = [...this.state.users].filter(user => user.userId !== userId);
        this.setState({users: updatedUsers, targetId: ''});
     },
      this.showError("remove user"));
  }

  doSearch() {
    this.setState({isLoading: true});
    this.contextParams.onSearch(
      this.state.pageNo,
      this.state.searchText,
      json => this.setState({users: json, isLoading: false}),
      this.showError("search users"));
  }

  handleChange(event) {
    const {name, value} = event.target;
    this.setState({[name]: value});
  }

  disallowsDelete(userId) {
    const targetUser = this.state.users.find(user => user.userId === userId)
    return (targetUser && (targetUser.taughtCourses.length > 0 || 
        targetUser.coordinatedSubjects.length > 0))
  } 

  setSelectedRowColor(rowId) {
    if (rowId === this.state.targetId) {
      return {backgroundColor:'#F0F8FF'}
    }
  }

  render() {
    const isLoading = this.state.isLoading;
    if (isLoading) {return (<AppSpinner/>)}
    const deleteUserFunction = () => {this.remove(this.state.targetId)};
    return (
      <div>
        {this.renderErrorModal()}
        <Container fluid>
          <Row xs="4">
            <Col> <h3>{this.title}</h3> </Col>
            <Col xs="6"> 
              {this.renderSearch ?  <SearchField 
                doSearch = {this.doSearch}
                searchText = {this.state.searchText}
                handleChange = {this.handleChange}/>
                : null}
            </Col>
            <Col>
              <ButtonBar 
                entityType = {this.entityType}
                targetId = {this.state.targetId} 
                deleteEntityFunction = {deleteUserFunction}
                disallowDelete = {this.applyDisallowDeleteFunction ? this.disallowsDelete(this.state.targetId) : false}
                consequenceList = {this.contextParams.onDeleteConsequenceList}
                addButtonTo = {this.addButtonTo}
                deleteButtonTo = {this.deleteButtonTo}
                onDisableDeleteTitle = {this.onDisableDeleteTitle}
                onDisableDeleteBody = {this.onDisableDeleteBody}
              />
            </Col>
          </Row>    
          <Table hover className="mt-4"> 
            <UserListHeaders/>
            <tbody>
              <UserList 
                users = {this.state.users}
                userOnClickFunction = {(userId) => {this.setState({targetId: userId})}}
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

const SearchField = props =>
  <InputGroup>
    <Input type="text" name="searchText" id="searchInput" placeholder="Type to search Users ..."
      value={props.searchText} onChange={props.handleChange}/>
    <InputGroupAddon addonType="append">
      <Button color="secondary" id="searchButton" onClick={props.doSearch}>
        <UncontrolledTooltip target="searchButton">
          Search Users
        </UncontrolledTooltip>
        <FontAwesomeIcon icon="search" size="1x"/>
      </Button>
    </InputGroupAddon>
  </InputGroup>;

export default FullUserList;