import React, { Component } from 'react';
import { CSVReader } from 'react-papaparse'
import { Container } from 'reactstrap';
import * as UserAPI from '../services/UserAPI';
import Log from '../auxiliar/Log'
import * as Constants from '../auxiliar/Constants'

export default class CsvUnitsImport extends Component {

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
      unitList: null, 
      csvData: null
    };
    this.setInnerPropValue = props.setInnerPropValue;
    this.handleOnDrop = props.handleOnDrop;
    this.handleOnError = props.handleOnError;
    this.handleOnRemoveFile = props.handleOnRemoveFile;
    this.config = props.config;
    this.handleSubmit = props.handleSubmit;
  }

  handleOnDrop = (jsonArray) => {
    // Recorre las rows parseadas a json de la libreria (los datos de usuarios). 
    let unitList = jsonArray.map((csvUnit) => {
      
      let csvKeys = Object.keys(csvUnit.data);
      
      // Recorre las keys y por cada una...
      return csvKeys.reduce((acc, curr) => {
        this.setInnerPropValue(acc, this.props.csvToJsonMap[curr], csvUnit.data[curr]);
        return acc;
      }, this.props.initialObj)
    })
    Log.info(unitList, 'UNIT LIST')
    this.setState({userList: unitList, fileIsNotLoaded: false})
  }

  handleOnError = (err) => { Log.info(err) }

  handleOnRemoveFile = () => { this.setState({fileIsNotLoaded: true}) }
  
  handleSubmit() {
    const {unitList: unitList} = this.state;
    let successUnits = [];
    let failedUnits = [];
    unitList.forEach(unit => {
      this.props.postFunction(unit, 
        () => successUnits.push(unit), 
        () => failedUnits.push(unit));
    })
    Log.info(successUnits, "ADDED UNITS LIST")
    Log.info(failedUnits, "ERROR UNITS LIST")
  }

  render() {
    return (
      <Container fluid>
        <CSVReader onDrop={this.handleOnDrop} 
          onError={this.handleOnError} 
          onRemoveFile={this.handleOnRemoveFile} 
          addRemoveButton progressBarColor='rgba(88, 14, 14, 0.6)' 
          config={Constants.parserConfig}>
          <span>{this.props.dropHereText}</span>
        </CSVReader>
      </Container>
    )
  }
}