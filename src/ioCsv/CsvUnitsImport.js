import React, { Component } from 'react';
import { CSVReader } from 'react-papaparse'
import { Container, Button, Jumbotron, Table } from 'reactstrap';
import Log from '../auxiliar/Log'
import * as Constants from '../auxiliar/Constants'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as AuxFunc from '../auxiliar/AuxiliarFunctions'
import Collapsable from '../buttons/Collapsable';
import ComponentWithErrorHandling from '../errorHandling/ComponentWithErrorHandling';
import AppSpinner from '../auxiliar/AppSpinner';

export default class CsvUnitsImport extends ComponentWithErrorHandling {

  /*
    csvToJsonMap = {}// Constants.userCsvToJsonMap
    initialObj =  // {isActive: true, personalData: {}, jobDetail: {}}
    postFunction = // API post function (ie. UserAPI.postUserAsync)
    dropHereText = "Drop CSV file here" // 
  */

  constructor(props) {
    super(props);
    this.state = {...this.state,
      fileIsNotLoaded: true, 
      unitList: [], 
      csvData: null,
      failedList: [], 
      successList: [],
      isImporting: false,
      parsingError: false
    };
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  showSuccess = () => {
    this.setState({
        isErrorModalOpen: true,
        lastError: {
            title: "Alright, everything worked...", 
            shortDesc: "Successfully imported Data" ,
            httpCode: '200',
        }
    })
  }

  handleOnDrop = (jsonArray) => {
    let parsingError = false;
    // Recorre las rows parseadas a json de la libreria (los datos de usuarios). 
    let list = jsonArray.map((csvUnit) => {
      let csvKeys = Object.keys(csvUnit.data);
      // Recorre las keys y por cada una...
      return csvKeys.reduce((acc, curr) => {
        try {
          AuxFunc.setInnerPropValue(acc, this.props.csvToJsonMap[curr], csvUnit.data[curr]);
        } catch (TypeError) { parsingError = true }
        return acc;
      }, this.props.initialObjFunc())
    })
    if (!parsingError) { this.setState({unitList: list, fileIsNotLoaded: false, parsingError: false}) }
    else {this.setState({parsingError: true})}
  }
  
  // Log.info(response, "RES")
  async handleSubmit() {
    this.setState({isImporting: true})
    const response = await this.postUnitsAsync()
    this.setState({successList: response.sc, failedList: response.fl, isImporting: false})
  }

  async postUnitsAsync() {
    let {unitList} = this.state, successList = [], failedList = []
    unitList.forEach(unit => { 
      this.props.postFunction(
        unit, 
        () => successList.push(unit), 
        () => failedList.push(unit))
    })
    // if (failedList.length === 0 ) { this.showSuccess() }
    // else { this.showError('import CSV. Check Log details. Make sure CSV has the correct format and you are not importing duplicated data')}
    return ({sc: successList, fl: failedList});
  }

  handleOnError = (err) => { Log.info(err) }

  handleOnRemoveFile = () => { 
    this.setState({fileIsNotLoaded: true, parsingError: false}) 
  }

  render() {
    const {successList, failedList, fileIsNotLoaded, isImporting, parsingError} = this.state
    return (
      <Container fluid>
        {this.renderErrorModal()}
        <CSVReader style={{color:'rgba(88, 14, 14, 0.6)'}}
          onDrop={this.handleOnDrop} 
          onError={this.handleOnError} 
          onRemoveFile={this.handleOnRemoveFile} 
          addRemoveButton progressBarColor='rgba(88, 34, 34, 1)' 
          config={Constants.parserConfig}>
          <span style={{textAlign:'center', marginBottom:32}}>
            {this.props.dropHereText}
          </span>
          <FontAwesomeIcon icon='file-csv' size='4x'></FontAwesomeIcon>
        </CSVReader>
        {fileIsNotLoaded && !parsingError ? 
        <Button block size="sm" color="primary" id="import" disabled style={{marginBottom:40, marginTop: 40, padding: 10}}>
          Please load a CSV file
        </Button>
        :
        <Button block size="sm" color={parsingError ? "danger" : "success"} id="import" onClick={this.handleSubmit} 
          disabled={fileIsNotLoaded || parsingError} style={{marginBottom:40, marginTop: 40, padding: 10}}>
          {parsingError ? "Parsing Error, check correct format of CSV file" : "Proceed with Import"}
        </Button> }
        <div>
          {isImporting ? <AppSpinner/> :
          <Jumbotron>
            <h1 className="display-9">Import Results</h1>
            <p className="lead">To view log results please remove file.</p>
            <hr className="my-2" />
            <Container fluid>
              <Collapsable entityTypeCapName={'Successes'} disabled={successList.length === 0}
                color={this.getCollapsableColor('successList')}>
                <div style={{ maxHeight:720, overflowY:'scroll'}}>
                  <Table hover className="mt-4">
                    <LogHeaders/>
                    <tbody><LogList units = {successList} /></tbody>
                  </Table>
                </div>
              </Collapsable>  
            </Container>
            <hr className="my-2" />
            <Container fluid>
              <Collapsable entityTypeCapName={'Failures'} disabled={failedList.length === 0} 
                color={this.getCollapsableColor('failedList')}>
                <div style={{ maxHeight:720, overflowY:'scroll'}}>
                  <Table hover className="mt-4">
                    <LogHeaders/>
                    <tbody><LogList units = {failedList}/></tbody>
                  </Table>
                </div>
              </Collapsable>
            </Container>
            <hr className="my-2" />
          </Jumbotron> }
        </div>
      </Container>
    )
  }

  getCollapsableColor(listName) {
    let color = 'secondary'
    const {successList, failedList} = this.state
    switch (listName) {
      case 'failedList': 
        if (failedList.length > 0) { color = 'danger' }
        break;
      case 'successList': 
        if (successList.length > 0) { color = 'success' }
        break;
      default: color = 'secondary'
    }
    return color;
  }
}

const th = { width: 'auto', position: 'sticky', top: 0, 
  color:"white", backgroundColor:"rgba(88,34,34,0.9)" };

const LogHeaders = () =>
<thead>
  <tr >
      <th style={th}>DNI</th>
      <th style={th}>First Name</th>
      <th style={th}>Last Name</th>
  </tr>
</thead>;

const LogList = props => {
  return props.units.map( (unit, index) => {
    return ( <UnitListItem key = {index} unit = {unit} /> )
  });
}

const tr = { whiteSpace: 'nowrap' };

const UnitListItem = props =>
  <tr id={props.unit.personalData.dni} key={props.unit.personalData.dni}>
    <td>{props.unit.personalData.dni || ''}</td>
    <td style={tr}>{props.unit.personalData.firstName || ''}</td>
    <td style={tr}>{props.unit.personalData.lastName || ''}</td>
  </tr>;