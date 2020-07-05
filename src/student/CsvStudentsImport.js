import React from 'react';
import { CSVReader } from 'react-papaparse'
import {withRouter } from 'react-router-dom';
import { Container, ButtonGroup, Row, Col, Button, UncontrolledTooltip } from 'reactstrap';
import AppNavbar from '../AppNavbar';
import CancelButton from '../buttons/CancelButton'
import * as StudentAPI from '../services/StudentAPI';
import ComponentWithErrorHandling from '../errorHandling/ComponentWithErrorHandling'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Log from '../auxiliar/Log'
import { userContext } from '../login/UserContext';
import AccessError from '../errorHandling/AccessError';
import * as Constants from '../auxiliar/Constants'

class CsvStudentsImport extends ComponentWithErrorHandling {

  constructor(props) {
    super(props);
    this.state = {...this.state, fileIsNotLoaded: true,
      studentList: null, csvData: null};
      this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleOnDrop = (jsonArray) => {
    // Recorre las rows parseadas a json de la libreria (los datos de usuarios). 
    let studentList = jsonArray.map((csvStudent) => {
      
      let csvKeys = Object.keys(csvStudent.data);
      
      // Recorre las keys y por cada una...
      return csvKeys.reduce((acc, curr) => {
        Log.info(Constants.studentsCsvToJsonMap[curr])
        this.setInnerPropValue(acc, Constants.studentsCsvToJsonMap[curr], csvStudent.data[curr]);
        return acc;
      }, {personalData: {}})
    })
    Log.info(studentList, 'STUDENT LIST')
    this.setState({studentList: studentList, fileIsNotLoaded: false})
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
    const {studentList} = this.state;
    let addedStudents = [];
    let errors = [];
    studentList.forEach(student => {
      StudentAPI.postStudentAsync(student, 
        () => addedStudents.push(student.personalData.email), 
        () => errors.push(student.personalData.email));
    })
    Log.info(addedStudents, "ADDED STUDENT LIST")
    Log.info(errors, "ERROR STUDENT LIST")
  }

  render() {
    let title = <h2 className="float-left">Add Students from CSV File</h2>
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
                      Submit Students
                  </UncontrolledTooltip>
                  <FontAwesomeIcon icon='play' size="2x" />
                </Button>
                <CancelButton onClick={() => this.props.history.goBack()} />
              </ButtonGroup>
            </Col>
          </Row>
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

CsvStudentsImport.contextType = userContext;
export default withRouter(CsvStudentsImport);