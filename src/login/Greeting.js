import React, {Component} from 'react';
import Log from '../Log'

export default class Greeting extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let message = (this.props.body.token)
      ? `Hi, ${JSON.stringify(this.props.body.registration.username)}!`
      : "You're not logged in.";
    return (
      <span>{message}</span>
    );
  }
}