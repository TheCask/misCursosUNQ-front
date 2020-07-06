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
      log: { failedList: [], successList: []}
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
    this.postUnitsAsync().then(({successUnits, failedUnits}) => {
      const log = this.state.log;
      log['successList'] = successUnits;
      log['failedList'] = failedUnits;
      this.setState({log: log})
    })
  }

  async postUnitsAsync() {
    const {unitList} = this.state;
    let successUnits = [];
    let failedUnits = [];
    unitList.forEach(unit => { 
      this.props.postFunction(
        unit, 
        () => successUnits.push(unit), 
        () => failedUnits.push(unit))
      }
    )
    return ({successUnits, failedUnits})
  }

  handleOnError = (err) => { Log.info(err) }

  handleOnRemoveFile = () => { this.setState({fileIsNotLoaded: true}) }

  render() {
    let successLog = this.state.log.successList
    let failedLog =  this.state.log.failedList
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
          disabled={this.state.fileIsNotLoaded} style={{marginBottom:40, marginTop: 40, padding: 10}}>
          Proceed with Import
        </Button>
        <div>
          <Jumbotron>
            <h1 className="display-9">Import Results</h1>
            <p className="lead">View success and failures of the import process</p>
            <hr className="my-2" />
            <Container fluid>
              <Collapsable entityTypeCapName={'Successes'} disabled={false}
                color={false ? 'secondary' : 'success'}>
                <div style={{ maxHeight:720, overflowY:'scroll'}}>
                  <Table hover className="mt-4">
                    <LogHeaders/>
                    <tbody>
                      <LogList units = {successLog} />
                    </tbody>
                  </Table>
                </div>
              </Collapsable>  
            </Container>
            <hr className="my-2" />
            <Container fluid>
              <Collapsable entityTypeCapName={'Failures'} disabled={false} 
                color={false ? 'secondary' : 'danger'}>
                <div style={{ maxHeight:720, overflowY:'scroll'}}>
                  <Table hover className="mt-4">
                    <LogHeaders/>
                    <tbody>
                      <LogList units = {failedLog} />
                    </tbody>
                  </Table>
                </div>
              </Collapsable>
            </Container>
          </Jumbotron>
        </div>
      </Container>
    )
  }
}

const th = { width: 'auto', position: 'sticky', top: 0, color:"white", backgroundColor:"rgba(88,34,34,0.9)" };
const LogHeaders = () =>
<thead>
  <tr >
      <th style={th}>{''}</th>
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
    <td>{''}</td>
    <td>{props.unit.personalData.dni || ''}</td>
    <td style={tr}>{props.unit.personalData.firstName || ''}</td>
    <td style={tr}>{props.unit.personalData.lastName || ''}</td>
  </tr>;