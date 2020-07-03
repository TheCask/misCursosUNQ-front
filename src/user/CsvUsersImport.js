import React from 'react';
import { CSVReader } from 'react-papaparse'
import {withRouter } from 'react-router-dom';
import { Container, Form, ButtonGroup, Row, Col, Button, UncontrolledTooltip } from 'reactstrap';
import AppNavbar from '../AppNavbar';
import CancelButton from '../buttons/CancelButton'
import * as UserAPI from '../services/UserAPI';
import ComponentWithErrorHandling from '../errorHandling/ComponentWithErrorHandling'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Log from '../auxiliar/Log'

const buttonRef = React.createRef()

class CsvUsersImport extends ComponentWithErrorHandling {

  CategoryOptions = ['', 'Auxiliar', 'Intructor/a', 'Adjunto/a', 'Asociado/a', 'Titular', 'Emérito/a', 'Consulto/a']
  GradeOptions = ['', 'A', 'B']
  ContractOptions = ['', 'Contratado/a', 'Interino/a', 'Ordinario/a']
  DedicationOptions = ['', 'Parcial', 'Semi-Exclusiva', 'Exclusiva']

  constructor(props) {
    super(props);
    this.state = {...this.state, fileIsNotLoaded: true,
      item: this.emptyItem, csvFile: null};
    this.beginLoading = this.beginLoading.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleOnFileLoad = (data) => {
    this.setState({item: data, fileIsNotLoaded: false})
    Log.info(this.state.item, "DATA")
  }

  completeCallback = () => {

  }

  errorCallback = () => {

  }

  handleOnError = (err) => { Log.info(err) }

  handleOnRemoveFile = (data) => { this.setState({fileIsNotLoaded: true}) }

  handleRemoveFile = (event) => {
    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current) {
      buttonRef.current.removeFile(event)
    }
  }

  async componentDidMount() {
    // if (this.props.match.params.id !== 'new') {
    //   UserAPI.getUserByIdAsync(this.props.match.params.id, 
    //     user => this.setState({item: user}), 
    //     this.showError("get user info"));
    // }
  }

  beginLoading() {
    // const {name, value} = event.target;
    // let item = {...this.state.item};
    // this.setInnerPropValue(item, name, value);
    // item['coordinatedSubjects'] = []
    // item['taughtCourses'] = []
    // this.setState({item});
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
  
  async handleSubmit(event) {
    event.preventDefault();
    const {item} = this.state;
    UserAPI.postUserAsync(item, 
      () => this.props.history.push('/users'), 
      this.showError("save user"));
  }

  render() {
    let title = <h2 className="float-left">Add Users from CSV File</h2>
    return (
      <AppNavbar>
        {this.renderErrorModal()}
        <Container fluid>
          <Form onSubmit={this.handleSubmit}>
          <Row xs="2">
            <Col>{title}</Col>
            <Col>
              <ButtonGroup className="float-right">
                <Button size="sm" color="primary" id="beginLoading" onClick={() => this.beginLoading()} 
                  disabled={this.state.fileIsNotLoaded}>
                  <UncontrolledTooltip placement="auto" target="beginLoading">
                      Begin Users Loading
                  </UncontrolledTooltip>
                  <FontAwesomeIcon icon='play' size="2x" />
                </Button>
                <CancelButton onClick={() => this.props.history.goBack()} />
              </ButtonGroup>
            </Col>
          </Row>
          <Row></Row>
          <Row xs="2">
            <CSVReader onDrop={this.handleOnDrop} onError={this.handleOnError} 
              onFileLoad={this.handleOnFileLoad} onRemoveFile={this.handleOnRemoveFile} 
              addRemoveButton removeButtonColor='rgba(88, 14, 14, 0.6)' progressBarColor='rgba(88, 14, 14, 0.6)' 
              config={this.parserConfig}>
              <span>Drop CSV file here or Click to upload.</span>
            </CSVReader>
          </Row>
          </Form>
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
    worker: true,
    comments: false,
    step: undefined,
    complete: this.completeCallback,
    error: this.errorCallback,
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

export default withRouter(CsvUsersImport);