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
import CsvUsersImport from '../user/CsvUsersImport'
import CsvStudentsImport from '../student/CsvStudentsImport'


class IoFromCsv extends ComponentWithErrorHandling {

    constructor(props) {
      super(props);
      this.state = {...this.state, fileIsNotLoaded: true,
        userList: null, csvData: null};
        this.handleSubmit = this.handleSubmit.bind(this);
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
                
              </Row>
            </Container>
          </AppNavbar>
      )}
    }
    
    IoFromCsv.contextType = userContext;
    export default withRouter(IoFromCsv);


