import React, { useState, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, 
  CardTitle, Row, Col, Container } from 'reactstrap';
import { userContext } from '../login/UserContext';
import classnames from 'classnames';
import * as Constants from '../auxiliar/Constants'
import CsvUnitsImport from './CsvUnitsImport'
import AppNavbar from '../AppNavbar'
import AccessError from '../errorHandling/AccessError'
import * as StudentAPI from '../services/StudentAPI';
import * as UserAPI from '../services/UserAPI';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const IoTabs = (props) => {
  const [activeTab, setActiveTab] = useState('1');
  const context = useContext(userContext);
  const toggle = tab => {
    if(activeTab !== tab) setActiveTab(tab);
  }
  let title = <h2 className="float-left">Import CSV File</h2>
  return (context.actualRol !== 'Cycle Coordinator' ?
    <AccessError errorCode="Guests are not allowed" 
        errorDetail="Make sure you are signed in with valid role before try to access this page"/>
    : 
    <AppNavbar>
      <Container fluid style={{paddingLeft:40}}>
        <Row xs="1">{title}</Row>
        <Row xs="1">
          <Nav tabs>
            <NavItem style={{color:"rgba(88, 14, 14, 0.7)"}}>
              <NavLink className={classnames({ active: activeTab === '1' })} onClick={() => { toggle('1'); }} >
                <FontAwesomeIcon icon="user-graduate" size="1x"/> {'  Students'}
              </NavLink>
            </NavItem>
            <NavItem style={{color:"rgba(88, 14, 14, 0.7)"}}>
              <NavLink  className={classnames({ active: activeTab === '2' })} onClick={() => { toggle('2'); }} >
              <FontAwesomeIcon icon="chalkboard-teacher" size="1x"/> {'  Users'}
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
            <Row>
              <Col sm="12">
                <Card body style={{backgroundColor:"rgba(20, 0, 0, 0.19)"}}>
                  {/* <CardTitle style={{textAlign:'center'}}> Import Students from CSV File </CardTitle> */}
                  {<CsvUnitsImport
                      csvToJsonMap = {Constants.studentCsvToJsonMap}// Constants.userCsvToJsonMap
                      initialObjFunc =  {Constants.initialStudent}// {isActive: true, personalData: {}, jobDetail: {}}
                      postFunction = {StudentAPI.postStudentAsync} // API post function (ie. UserAPI.postUserAsync)
                      dropHereText = "Drop CSV file or Click here" // 
                  />}
                </Card>
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row>
              <Col sm="12">
                <Card body style={{backgroundColor:"rgba(20, 0, 0, 0.20)"}}>
                  {/* <CardTitle style={{textAlign:'center'}}> Import Users from CSV File </CardTitle> */}
                  {<CsvUnitsImport
                      csvToJsonMap = {Constants.userCsvToJsonMap}// Constants.userCsvToJsonMap
                      initialObjFunc =  {Constants.initialUser}// {isActive: true, personalData: {}, jobDetail: {}}
                      postFunction = {UserAPI.postUserAsync} // API post function (ie. UserAPI.postUserAsync)
                      dropHereText = "Drop CSV file or Click here" // 
                  />}
                </Card>
              </Col>
            </Row>
          </TabPane>
          </TabContent>
        </Row>
      </Container>
    </AppNavbar>
  );
}
IoTabs.contextType = userContext;
export default withRouter(IoTabs);