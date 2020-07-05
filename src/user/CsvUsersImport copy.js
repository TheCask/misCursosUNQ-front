import React, { Component } from 'react';
import { CSVReader } from 'react-papaparse'
import { Container } from 'reactstrap';
import * as UserAPI from '../services/UserAPI';
import Log from '../auxiliar/Log'
import * as Constants from '../auxiliar/Constants'

export default class CsvUsersImport extends Component {

  constructor(props) {
    super(props);
    this.state = {...this.state, fileIsNotLoaded: true,
      userList: null, csvData: null};
      this.setInnerPropValue = props.setInnerPropValue;
      this.handleOnDrop = props.handleOnDrop;
      this.handleOnError = props.handleOnError;
      this.handleOnRemoveFile = props.handleOnRemoveFile;
      this.config = props.config;
      this.handleSubmit = props.handleSubmit;
  }

  handleOnDrop = (jsonArray) => {
    // Recorre las rows parseadas a json de la libreria (los datos de usuarios). 
    let userList = jsonArray.map((csvUser) => {
      
      let csvKeys = Object.keys(csvUser.data);
      
      // Recorre las keys y por cada una...
      return csvKeys.reduce((acc, curr) => {
        this.setInnerPropValue(acc, Constants.userCsvToJsonMap[curr], csvUser.data[curr]);
        return acc;
      }, {isActive: true, personalData: {}, jobDetail: {}})
    })
    Log.info(userList, 'USER LIST')
    this.setState({userList: userList, fileIsNotLoaded: false})
  }

  handleOnError = (err) => { Log.info(err) }

  handleOnRemoveFile = () => { this.setState({fileIsNotLoaded: true}) }
  
  handleSubmit() {
    const {userList} = this.state;
    let addedUsers = [];
    let errors = [];
    userList.forEach(user => {
      UserAPI.postUserAsync(user, 
        () => addedUsers.push(user.personalData.email), 
        () => errors.push(user.personalData.email));
    })
    Log.info(addedUsers, "ADDED USERS LIST")
    Log.info(errors, "ERROR USERS LIST")
  }

  render() {
    return (
        <Container fluid>
            <CSVReader onDrop={this.handleOnDrop} 
              onError={this.handleOnError} onRemoveFile={this.handleOnRemoveFile} 
              addRemoveButton progressBarColor='rgba(88, 14, 14, 0.6)' 
              config={Constants.parserConfig}>
              <span>Drop Users CSV file here or Click to upload.</span>
            </CSVReader>
        </Container>
    )
  }
}