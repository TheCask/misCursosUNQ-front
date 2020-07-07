import React, { Component } from 'react';
import { CSVReader } from 'react-papaparse'
import { Container, Button, Jumbotron, Table } from 'reactstrap';
import Log from '../auxiliar/Log'
import * as Constants from '../auxiliar/Constants'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as AuxFunc from '../auxiliar/AuxiliarFunctions'
import Collapsable from '../buttons/Collapsable';

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
      unitList: [], 
      csvData: null,
      failedList: [], 
      successList: []
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
  
  handleSubmit() {
    this.postUnitsAsync().then(({successList, failedList}) => {
      this.setState({successList: successList, failedList: failedList, fileIsNotLoaded: true})
    })
  }

  async postUnitsAsync() {
    let {unitList, successList, failedList} = this.state;
    unitList.forEach(unit => { 
      this.props.postFunction(
        unit, 
        () => successList.push(unit), 
        () => failedList.push(unit))
    })
    return ({successList, failedList});
  }

  handleOnError = (err) => { Log.info(err) }

  handleOnRemoveFile = () => { this.setState({fileIsNotLoaded: true}) }

  render() {
    let {successList, failedList, fileIsNotLoaded} = this.state
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
          disabled={fileIsNotLoaded} style={{marginBottom:40, marginTop: 40, padding: 10}}>
          Proceed with Import
        </Button>
        <div>
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
          </Jumbotron>
        </div>
      </Container>
    )
  }

  getCollapsableColor(listName) {
    let color = 'secondary'
    let {successList, failedList} = this.state
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