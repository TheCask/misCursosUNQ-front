import React, { Component } from 'react';
import ErrorModal from './ErrorModal';

export default class ComponentWithErrorHandling extends Component {

   /*
    You can create your own handler like this:

   handleGetStudentError = (errorCode, errorText) => {
    this.setState({
      isErrorModalOpen: true,
      lastError: {
        title: "Ups, something went wrong...", 
        shortDesc: "An error occurred while trying to get student details." ,
        httpCode: "HTTP CODE: " + errorCode,
        errorText: errorText
      }
    })

    Or use the easy constructor:

    buildHandler("get sudent details")
  }
   
   */ 

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

  buildHandler(whileTryingTo){
      return (errorCode, errorText) => {
            this.setState({
              isErrorModalOpen: true,
              lastError: {
                title: "Ups, something went wrong...", 
                shortDesc: "An error occurred while trying to " + whileTryingTo + "." ,
                httpCode: "HTTP CODE: " + errorCode,
                errorText: errorText
              }
            })

        }
  }
}

