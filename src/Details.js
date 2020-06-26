import React, { Component } from 'react'; //{Component}
import UserEdit from './UserEdit'

export class UserDetail extends Component {
  render() {
    return( <UserEdit onlyDetail={true}/>)
  }
}