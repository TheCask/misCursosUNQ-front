import React, { Component } from 'react';
import { CSVReader } from 'react-papaparse'
import { Container, Button, UncontrolledTooltip } from 'reactstrap';
import Log from '../auxiliar/Log'
import * as Constants from '../auxiliar/Constants'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as AuxFunc from '../auxiliar/AuxiliarFunctions'

export default class CsvUnitsImport extends Component {

  /*
    
    csvToJsonMap = {}// Constants.userCsvToJsonMap
    initialObj =  // {isActive: true, personalData: {}, jobDetail: {}}
    postFunction = // API post function (ie. UserAPI.postUserAsync)
    dropHereText = "Drop CSV file here" // 
  
  */

  constructor(props) {
    super(props);
    this.state = {
      fileIsNotLoaded: true, 
      unitList: null, 
      csvData: null
    };
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleOnDrop = (jsonArray) => {
    // Recorre las rows parseadas a json de la libreria (los datos de usuarios). 
    let list = jsonArray.map((csvUnit) => {
      
      let csvKeys = Object.keys(csvUnit.data);
      
      // Recorre las keys y por cada una...
      return csvKeys.reduce((acc, curr) => {
        AuxFunc.setInnerPropValue(acc, this.props.csvToJsonMap[curr], csvUnit.data[curr]);
        return acc;
      }, this.props.initialObjFunc())
    })
    this.setState({unitList: list, fileIsNotLoaded: false})
  }

  handleOnError = (err) => { Log.info(err) }

  handleOnRemoveFile = () => { this.setState({fileIsNotLoaded: true}) }
  
  handleSubmit() {
    Log.info(this.state.unitList, "UNIT LIST")
    const {unitList} = this.state;
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
        <Button block size="sm" color="primary" id="import" onClick={this.handleSubmit} 
          disabled={this.state.fileIsNotLoaded} style={{marginTop: 40, padding: 10}}>
          Proceed with Import
        </Button>
      </Container>
    )
  }
}