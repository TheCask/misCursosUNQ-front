import React from 'react';
import { withRouter } from 'react-router-dom';
import { userContext } from '../login/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Container, Form, FormGroup, Input, ButtonGroup, Label, UncontrolledTooltip, 
  Row, Col, Button } from 'reactstrap';
import AppNavbar from '../AppNavbar';
import SaveButton from '../buttons/SaveButton'
import CancelButton from '../buttons/CancelButton'
import ComponentWithErrorHandling from '../errorHandling/ComponentWithErrorHandling'
import AccessError from '../errorHandling/AccessError';
import * as UserAPI from '../services/UserAPI';
import * as Constants from '../auxiliar/Constants'
import * as AuxFunc from '../auxiliar/AuxiliarFunctions'
  
class UserEdit extends ComponentWithErrorHandling {

  constructor(props) {
    super(props);
    this.state = {...this.state, ...{
      item: Constants.emptyUser,
    }};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.activateUser = this.activateUser.bind(this);
    this.onlyDetail = props.onlyDetail || false;
  }

  async componentDidMount() {
    if (this.props.match.params.id !== 'new') {
      UserAPI.getUserByIdAsync(this.props.match.params.id, 
        user => this.setState({item: user}), 
        this.showError("get user info"));
    }
  }

  handleChange(event) {
    const {name, value} = event.target;
    let item = {...this.state.item};
    AuxFunc.setInnerPropValue(item, name, value);
    item['coordinatedSubjects'] = []
    item['taughtCourses'] = []
    this.setState({item});
  }
  
  async handleSubmit(event) {
    event.preventDefault();
    const {item} = this.state;
    UserAPI.postUserAsync(item, 
      () => this.props.history.push('/users'), 
      this.showError("save user"));
  }

  chooseTitle(onlyDetail) {
    let title = ''
    if (onlyDetail) { title = 'User Details' }
    else if (this.props.match.params.id === 'new') { title = 'Add User'}
    else { title = 'Edit User'}
    return <h2 className="float-left">{title}</h2>;
  }

  activateUser(event) {
    let item = {...this.state.item};
    item["isActive"] = true;
    this.setState({item});
  }

  render() {
    const {item} = this.state;
    let onlyDetail = this.onlyDetail;
    let title = this.chooseTitle(onlyDetail);
    this.actualRol = this.context.actualRol;
    return (this.actualRol === 'Guest' || (this.actualRol === 'Teacher' && !onlyDetail) ?
      <AccessError errorCode="Only Cycle Coordinator are allowed" 
          errorDetail="Make sure you are signed in with valid role before try to access this page"/>
      : <AppNavbar>
        {this.renderErrorModal()}
        <Container fluid>
          <Form onSubmit={this.handleSubmit}>
          <Row xs="2">
            <Col>{title}</Col>
            <Col>
              <ButtonGroup className="float-right">
                <SaveButton entityId = {item.userId} entityTypeCapName = "User" disabled={onlyDetail}/>
                {' '}
                <CancelButton onClick={() => this.props.history.goBack()} />
              </ButtonGroup>
          </Col>
          </Row>
          <Row form>
            <Col xs="2">
            <FormGroup>
              <Label for="dni">DNI Number</Label>
              <Input type="number"  min="0" max="2147483647" name="personalData.dni" id="dni" value={item.personalData.dni}
                    onChange={this.handleChange} placeholder="DNI" required disabled={onlyDetail}/>
            </FormGroup>
            </Col>
            <Col xs="5">
            <FormGroup>
              <Label for="firstName">First Name</Label>
              <Input type="text" maxLength="50" name="personalData.firstName" id="firstName" value={item.personalData.firstName}
                    onChange={this.handleChange} placeholder="First Name" required disabled={onlyDetail}/>
            </FormGroup>
            </Col>
            <Col xs="5">
            <FormGroup>
              <Label for="lastName">Last Name</Label>
              <Input type="text" maxLength="50" name="personalData.lastName" id="lastName" value={item.personalData.lastName}
                    onChange={this.handleChange} placeholder="Last Name" required disabled={onlyDetail}/>
            </FormGroup>
            </Col>
          </Row>
          <Row form>
            <Col xs="5">
            <FormGroup>
              <Label for="email">Mail</Label>
              <Input type="text" maxLength="50" name="personalData.email" id="email" value={item.personalData.email}
                    title="Formato admitido: usuario@servidor.dom" required disabled={onlyDetail}
                    onChange={this.handleChange} placeholder="e Mail" pattern="^.*@.*\..*$"/>
            </FormGroup>
            </Col>
            <Col xs="4">
            <FormGroup>
              <Label for="cellPhone">Cell Phone</Label>
              <Input type="tel" name="personalData.cellPhone" id="cellPhone" value={item.personalData.cellPhone || ''}
                    title="Separar característica y número con un guión (no incluir 15 al inicio). Ej. 0229-4787658"
                    onChange={this.handleChange} placeholder="Cell Phone" pattern="\d{2,4}-\d{6,8}" required disabled={onlyDetail}/>
            </FormGroup>
            </Col>
            <Col xs="3">
            <FormGroup>
              <Label for="cuitNumber">CUIT/CUIL</Label>
              <Input type="text" name="jobDetail.cuitNumber" id="cuitNumber" value={item.jobDetail.cuitNumber || ''}
                    title="Separar con guiones. Ej. 20-12345678-3" disabled={onlyDetail}
                    onChange={this.handleChange} placeholder="Cuit Number" pattern="\d{2}-\d{8}-\d"/>
            </FormGroup>
            </Col>
          </Row>
          <Row form>
            <Col xs="3">
            <FormGroup>
              <Label for="category">Category</Label>
              <Input type="select" name="jobDetail.category" id="category" value={item.jobDetail.category}
                    onChange={this.handleChange} disabled={onlyDetail}>
                    {this.categoryOptions()}
              </Input>
              <UncontrolledTooltip placement="auto" target="category"> Select Category </UncontrolledTooltip>
            </FormGroup>
            </Col>
            <Col xs="1">
            <FormGroup>
              <Label for="grade">Grade</Label>
              <Input type="select" name="jobDetail.grade" id="grade" value={item.jobDetail.grade}
                    onChange={this.handleChange} disabled={onlyDetail}>
                    {this.gradeOptions()}
              </Input>
              <UncontrolledTooltip placement="auto" target="grade"> Select Grade </UncontrolledTooltip>
            </FormGroup>
            </Col>
            <Col xs="3">
            <FormGroup>
              <Label for="dedication">Dedication</Label>
              <Input type="select" name="jobDetail.dedication" id="dedication" value={item.jobDetail.dedication}
                    onChange={this.handleChange} disabled={onlyDetail}>
                    {this.dedicationOptions()}
              </Input>
              <UncontrolledTooltip placement="auto" target="dedication"> Select Dedication </UncontrolledTooltip>
            </FormGroup>
            </Col>
            <Col xs="3">
            <FormGroup>
            <Label for="relation">Contract Relation</Label>
              <Input type="select" name="jobDetail.contractRelation" id="relation" value={item.jobDetail.contractRelation}
                    onChange={this.handleChange} disabled={onlyDetail}>
                    {this.contractOptions()}
              </Input>
              <UncontrolledTooltip placement="auto" target="relation"> Select Contract Relation </UncontrolledTooltip>
            </FormGroup>
            </Col>
            <Col xs="2">
            <FormGroup>
              <Label for="aditional">Aditional Hours</Label>
              <Input type="number" name="jobDetail.aditionalHours" id="aditional" value={item.jobDetail.aditionalHours}
                    onChange={this.handleChange} disabled={onlyDetail}/>
            </FormGroup>
            </Col>
          </Row>
          <Row form xs="1">
            <FormGroup>
              <Label for="gradeTitles">Grade Titles</Label>
              <Input type="text" maxLength="200" name="jobDetail.gradeTitles" id="gradeTitles" value={item.jobDetail.gradeTitles || ''}
                    onChange={this.handleChange} placeholder="Grade Titles" disabled={onlyDetail}/>
            </FormGroup>
          </Row>
          <Row form xs="1">
            <FormGroup>
              <Label for="posGradeTitles">Posgrade Titles</Label>
              <Input type="text" maxLength="200" name="jobDetail.posGradeTitles" id="posGradeTitles" value={item.jobDetail.posGradeTitles || ''}
                    onChange={this.handleChange} placeholder="Posgrade Titles" disabled={onlyDetail}/>
            </FormGroup>
          </Row>
          <Row form>
            <Col xs="7">
            <FormGroup>
              <Label for="cvUrl">CV Link</Label>
              <Input type="url" name="jobDetail.cvURL" id="cvUrl" value={item.jobDetail.cvURL || ''}
                    onChange={this.handleChange} placeholder="CV URL" disabled={onlyDetail}/>
            </FormGroup>
            </Col>
            <Col xs="3">
            <FormGroup>
              <Label for="update">Last CV Update</Label>
              <Input type="date" name="jobDetail.lastUpdate" id="update" value={item.jobDetail.lastUpdate || ''}
                    onChange={this.handleChange} disabled/>
            </FormGroup>
            </Col>
            <Col xs="2">
              <Label for="activeStatus">Active Status</Label>
              <FormGroup>
              <ButtonGroup size="sm" id="activeStatus">
                {item.isActive ?
                  <>
                  <Button outline color="success" id="isActive" disabled>
                    <FontAwesomeIcon icon='user' size="2x" id="isActive"/>
                  </Button>
                  <UncontrolledTooltip placement="auto" target="activeStatus"> Active User </UncontrolledTooltip>
                  </>
                  :
                  <>
                  <Button outline color="danger" id="isInactive" onClick={this.activateUser} disabled={onlyDetail}>
                    <FontAwesomeIcon icon='user-slash' size="2x" id="isInactive"/>
                  </Button>
                  { onlyDetail ? 
                  <UncontrolledTooltip placement="auto" target="activeStatus"> Inactive User </UncontrolledTooltip>
                  : 
                  <UncontrolledTooltip placement="auto" target="activeStatus"> Activate User </UncontrolledTooltip> }
                  </>
                }
              </ButtonGroup>
              </FormGroup>
            </Col>
          </Row>
          </Form>
        </Container>
      </AppNavbar>
  )}
  
  categoryOptions() {
    return ( Constants.CategoryOptions.map(ct => {
      return (<option key={ct}>{ct}</option>) 
    }))
  }

  gradeOptions() {
    return ( Constants.GradeOptions.map(gd => {
      return (<option key={gd}>{gd}</option>) 
    }))
  }
  
  contractOptions() {
    return ( Constants.ContractOptions.map(ct => {
      return (<option key={ct}>{ct}</option>) 
    }))
  }
  
  dedicationOptions() {
    return ( Constants.DedicationOptions.map(dc => {
      return (<option key={dc}>{dc}</option>) 
    }))
  }
}

UserEdit.contextType = userContext;
export default withRouter(UserEdit);