import React, { Component } from 'react';
import ErrorModal from './ErrorModal';

export default class ComponentWithErrorHandling extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isErrorModalOpen: false,
      lastError: {title: "", shortDesc: "", httpCode: "", errorText:""}
    };
    this.toggleErrorModal = this.toggleErrorModal.bind(this);
  }

  toggleErrorModal() {
    this.setState({
      isErrorModalOpen: !this.state.isErrorModalOpen
    });
  }

  renderErrorModal(){
    return <ErrorModal
        isOpen = {() => this.state.isErrorModalOpen}
        lastError = {this.state.lastError}
        toggle={this.toggleErrorModal}
    />
  }
}

