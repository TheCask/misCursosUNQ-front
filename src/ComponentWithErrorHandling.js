import React, { Component } from 'react';
import ErrorModal from './ErrorModal';

export default class ComponentWithErrorHandling extends Component {

   /*
    By extending this class you get some easy error handling.

    You can use the easy constructor:

        this.buildHandler("get student details")
    
    Or create your own handler like this:

        // When calling this function with the appropiate details (errorCode and errorText), an error modal will show up.
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
        }

    Remember to include the modal rendering in your ComponentWithErrorHandling extending class:

        {this.renderErrorModal()}
   
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

