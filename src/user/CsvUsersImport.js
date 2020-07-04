import React from 'react';
import { CSVReader } from 'react-papaparse'
import {withRouter } from 'react-router-dom';
import { Container, ButtonGroup, Row, Col, Button, UncontrolledTooltip } from 'reactstrap';
import AppNavbar from '../AppNavbar';
import CancelButton from '../buttons/CancelButton'
import * as UserAPI from '../services/UserAPI';
import ComponentWithErrorHandling from '../errorHandling/ComponentWithErrorHandling'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Log from '../auxiliar/Log'
import { userContext } from '../login/UserContext';
import AccessError from '../errorHandling/AccessError';
import * as Constants from '../auxiliar/Constants'

class CsvUsersImport extends ComponentWithErrorHandling {

  constructor(props) {
    super(props);
    this.state = {...this.state, fileIsNotLoaded: true,
      userList: null, csvData: null};
      this.handleSubmit = this.handleSubmit.bind(this);
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

  setInnerPropValue(baseObj, subPropString, value){
    const subProps = subPropString.split(".");
    const lastPropName = subProps.pop(); // elimina del array y retorna el ultimo 
    let propRef = baseObj
    subProps.forEach(subprop => {
      propRef = propRef[subprop];
    });
    propRef[lastPropName] = value;
  }

  handleOnError = (err) => { Log.info(err) }

  handleOnRemoveFile = (data) => { this.setState({fileIsNotLoaded: true}) }
  
  handleSubmit(event) {
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
    let title = <h2 className="float-left">Add Users from CSV File</h2>
    this.actualRol = this.context.actualRol;
    return (this.actualRol !== 'Cycle Coordinator' ?
      <AccessError errorCode="Guests are not allowed" 
          errorDetail="Make sure you are signed in with valid role before try to access this page"/>
      : 
      <AppNavbar>
        {this.renderErrorModal()}
        <Container fluid>
          <Row xs="2">
            <Col>{title}</Col>
            <Col>
              <ButtonGroup className="float-right">
                <Button size="sm" color="primary" id="beginLoading" onClick={this.handleSubmit} 
                  disabled={this.state.fileIsNotLoaded}>
                  <UncontrolledTooltip placement="auto" target="beginLoading">
                      Submit Users
                  </UncontrolledTooltip>
                  <FontAwesomeIcon icon='play' size="2x" />
                </Button>
                <CancelButton onClick={() => this.props.history.goBack()} />
              </ButtonGroup>
            </Col>
          </Row>
          <Row></Row>
          <Row xs="2">
            <CSVReader onDrop={this.handleOnDrop} 
              onError={this.handleOnError} onRemoveFile={this.handleOnRemoveFile} 
              addRemoveButton progressBarColor='rgba(88, 14, 14, 0.6)' 
              config={Constants.parserConfig}>
              <span>Drop CSV file here or Click to upload.</span>
            </CSVReader>
          </Row>
        </Container>
      </AppNavbar>
  )}
}

CsvUsersImport.contextType = userContext;
export default withRouter(CsvUsersImport);