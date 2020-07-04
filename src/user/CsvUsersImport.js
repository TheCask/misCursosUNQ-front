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

class CsvUsersImport extends ComponentWithErrorHandling {

  csvToJsonMapping = {
    dni: 'personalData.dni',
    firstName: 'personalData.firstName',
    lastName: 'personalData.lastName',
    email: 'personalData.email',
    cellPhone: 'personalData.cellPhone',
    cuitNumber: 'jobDetail.cuitNumber',
    category: 'jobDetail.category',
    grade: 'jobDetail.grade',
    dedication: 'jobDetail.dedication',
    contractRelation: 'jobDetail.contractRelation',
    aditionalHours: 'jobDetail.aditionalHours',
    cvURL: 'jobDetail.cvURL',
    lastUpdate: 'jobDetail.lastUpdate',
    gradeTitles: 'jobDetail.gradeTitles',
    posGradeTitles: 'jobDetail.posGradeTitles'
  };

  CategoryOptions = ['', 'Auxiliar', 'Intructor/a', 'Adjunto/a', 'Asociado/a', 'Titular', 'Emérito/a', 'Consulto/a']
  GradeOptions = ['', 'A', 'B']
  ContractOptions = ['', 'Contratado/a', 'Interino/a', 'Ordinario/a']
  DedicationOptions = ['', 'Parcial', 'Semi-Exclusiva', 'Exclusiva']

  constructor(props) {
    super(props);
    this.state = {...this.state, fileIsNotLoaded: true,
      item: this.emptyItem, userList: null, csvData: null};
      this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleOnDrop = (jsonArray) => {
    let baseUser = {isActive: true, personalData: {}, jobDetail: {}}
    Log.info(jsonArray, 'JSON ARRAY')
    let userList = jsonArray.map((csvUser) => {
      
      let csvKeys = Object.keys(csvUser.data);
      return csvKeys.reduce((acc, curr) => {
        this.setInnerPropValue(acc, this.csvToJsonMapping[curr], csvUser.data[curr]);
        return acc;
      }, baseUser)
    })
    Log.info(userList, 'USR LIST')
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

    userList.forEach(user => {
      UserAPI.postUserAsync(user, 
        () => {}, 
        this.showError("save user"));
    })
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
          {/* <Form onSubmit={this.handleSubmit}> */}
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
              addRemoveButton removeButtonColor='rgba(88, 14, 14, 0.6)' progressBarColor='rgba(88, 14, 14, 0.6)' 
              config={this.parserConfig}>
              <span>Drop CSV file here or Click to upload.</span>
            </CSVReader>
          </Row>
          {/* </Form> */}
        </Container>
      </AppNavbar>
  )}
  
  emptyItem = {
    isActive: true,
    personalData: {
      dni: '',
      firstName: '',
      lastName: '',
      email: '',
      cellPhone: '' 
    },
    jobDetail: {
      cuitNumber: '',
      category: '',
      grade: '',
      dedication: '',
      contractRelation: '',
      aditionalHours: 0,
      cvURL: '',
      lastUpdate: '',
      gradeTitles: '',
      posGradeTitles: ''
    },
    coordinatedSubjects: [],
    taughtCourses: []
  };
  
  parserConfig = {
    delimiter: "",  // auto-detect
    newline: "",  // auto-detect
    quoteChar: '"',
    escapeChar: '"',
    header: true,
    transformHeader: undefined,
    dynamicTyping: true,
    preview: 0,
    encoding: "",
    worker: false,
    comments: false,
    step: undefined,
    complete: undefined,
    error: undefined,
    download: false,
    downloadRequestHeaders: undefined,
    skipEmptyLines: false,
    chunk: undefined,
    fastMode: undefined,
    beforeFirstChunk: undefined,
    withCredentials: undefined,
    transform: undefined,
    delimitersToGuess: [',', '	', '|', ';']
  }
}

CsvUsersImport.contextType = userContext;
export default withRouter(CsvUsersImport);