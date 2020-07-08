import React from 'react';
import { CSVReader } from 'react-papaparse'
import { Container, Button, Jumbotron, Table, Progress, Row } from 'reactstrap';
import Log from '../auxiliar/Log'
import * as Constants from '../auxiliar/Constants'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as AuxFunc from '../auxiliar/AuxiliarFunctions'
import Collapsable from '../buttons/Collapsable';
import ComponentWithErrorHandling from '../errorHandling/ComponentWithErrorHandling';

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
      actualUnit: 0,
      totalUnits: 0,
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
    if (!parsingError) { this.setState({unitList: list, fileIsNotLoaded: false, parsingError: false, totalUnits: list.length}) }
    else {this.setState({parsingError: true, totalUnits: 0})}
  }
  
  async handleSubmit() {
    const response = await this.postUnitsAsync()
    this.setState({successList: response.sc, failedList: response.fl})
  }

  async postUnitsAsync() {
    const {unitList} = this.state
    let successList = [], failedList = [], progressValue = 0;
    unitList.forEach(unit => {
      this.props.postFunction(
        unit, 
        () => {
          successList.push(unit);
          progressValue = progressValue + 1
          this.setState({actualUnit: progressValue})
        },
        () => {
          failedList.push(unit);
          progressValue = progressValue + 1
          this.setState({actualUnit: progressValue})
        })
    })
    return ({sc: successList, fl: failedList});
  }

  handleOnError = (err) => { Log.info(err) }

  handleOnRemoveFile = () => { 
    this.setState({fileIsNotLoaded: true, parsingError: false, totalUnits: 0, actualUnit: 0}) 
  }

  render() {
    const {successList, failedList, fileIsNotLoaded, parsingError, totalUnits, actualUnit} = this.state
    let existsSuccesses = successList.length > 0
    let existsFails = failedList.length > 0
    let progressStyleBool = totalUnits !== actualUnit
    let notFileOrParsingError = fileIsNotLoaded || parsingError
    let disableSuccessLog = notFileOrParsingError || !existsSuccesses
    let disableFailedLog = notFileOrParsingError || !existsFails
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
          disabled={notFileOrParsingError} style={{marginBottom:40, marginTop: 40, padding: 10}}>
          {parsingError ? "Parsing Error, check correct format of CSV file" : "Proceed with Import"}
        </Button> }
        <div>
        {/* progressStyleBool ? 'warning' : 'success' */}
          <Jumbotron>
            { notFileOrParsingError ? <Progress color='secondary' value='0' /> :
            <Progress animated={progressStyleBool} color={this.getProgressBarColor()} 
              value={actualUnit} max={totalUnits} />
            }
            <hr className="my-2" />
            <Container fluid>
              <Row xs="2">
              <Collapsable entityTypeCapName={'Successes'} disabled={disableSuccessLog}
                color={existsSuccesses ? 'success' : 'secondary'}>
                <div style={{ maxHeight:720, overflowY:'scroll'}}>
                  <Table size='sm' hover className="mt-4">
                    <LogHeaders/>
                    <tbody><LogList units = {successList} /></tbody>
                  </Table>
                </div>
              </Collapsable>
              <Collapsable entityTypeCapName={'Failures'} disabled={disableFailedLog} 
                color={existsFails ? 'danger' : 'secondary'}>
                <div style={{ maxHeight:720, overflowY:'scroll'}}>
                  <Table size='sm' hover className="mt-4">
                    <LogHeaders/>
                    <tbody><LogList units = {failedList}/></tbody>
                  </Table>
                </div>
              </Collapsable>
              </Row>
            </Container>
          </Jumbotron>
        </div>
      </Container>
    )
  }

  getProgressBarColor() {
    let color = 'warning'
    const {failedList, totalUnits, actualUnit} = this.state
    if (totalUnits === actualUnit) {
      let fails = failedList.length
      if (fails > 0 && fails > (totalUnits / 2)) { color = 'danger'}
      else if (fails === 0) {color = 'success'}
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
      <th style={th}>eMail</th>
      <th style={th}>Name</th>
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
    <td>{props.unit.personalData.email || ''}</td>
    <td style={tr}>{props.unit.personalData.lastName + ', ' +  props.unit.personalData.firstName || ''}</td>
  </tr>;