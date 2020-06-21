import React  from 'react';
import { Button, UncontrolledTooltip, Media } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as AuthAPI from '../services/AuthAPI';
import AppSpinner from '../AppSpinner';
import ComponentWithErrorHandling from '../errorHandling/ComponentWithErrorHandling';

export default class Greeting extends ComponentWithErrorHandling {

  constructor(props) {
    super(props);
    this.state = {isErrorModalOpen: true, 
      lastError: {title: "", description: "", error: null},
      body: {}, isLoading: true};
  }

  async componentDidMount() {
    AuthAPI.getGlobalUserByIdAsync(json => this.setState({body: json, isLoading: false}), 
      this.showError("get global user"));
  }

  render() {
    if (this.state.isLoading) { return (<AppSpinner/>) }
    let globalUser = this.state.body.user;
    let message = (globalUser)
      ? <ProfileButton greeting={globalUser.username ? globalUser.username : globalUser.email}
          avatar={globalUser.imageUrl ? globalUser.imageUrl : <FontAwesomeIcon icon='id-card' size="lg" /> } />
      : "";
    return (<span>{message}</span>);
  }
}
//style={{backgroundColor:"rgba(20, 0, 0, 0.40)"
const ProfileButton = (props) => {
  return (
        <Button block size="lg" color="rgba(20, 0, 0, 0.40)" href={'/profile'} id="profile">
          <Media width="32" object src={props.avatar} alt="User Avatar" />
          {" "}
          {JSON.stringify(props.greeting).replace(/["]/g,"")}
          <UncontrolledTooltip placement="auto" target="profile">
            Edit Profile
          </UncontrolledTooltip>
        </Button>
  )
}