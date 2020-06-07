import React, { Component } from 'react';

export default class ErrorHandler extends Component {

  constructor(props){
    super(props);
    this.state={hasError:false}
  }
 
  render() {
  	if(this.state.hasError){
    	return <div>Something went wrong</div>
    }
    
  	return (
    	this.props.children
    );
  }
  componentDidCatch(error,errorInfo){
  	this.setState({
	    hasError:true
    })
   }
}