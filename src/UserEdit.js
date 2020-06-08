import React, { Component } from 'react';
import {withRouter } from 'react-router-dom';
import { Container, Form, FormGroup, Input, ButtonGroup, Label, UncontrolledTooltip, Row, Col } from 'reactstrap';
import AppNavbar from './AppNavbar';
import SaveButton from './buttonBar/SaveButton'
import CancelButton from './buttonBar/CancelButton'
import * as UserAPI from './services/UserAPI';
import ComponentWithErrorHandling from './errorHandling/ComponentWithErrorHandling'


class UserEdit extends ComponentWithErrorHandling {

  emptyItem = {
      personalData: {
          dni: null,
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
          aditionalHours: '',
          cvURL: '',
          lastUpdate: '',
          gradeTitles: [],
          posGradeTitles: []
      },
      coordinatedSubjects: [],
      taughtCourses: []
  };

  constructor(props) {
    super(props);
    this.state = {...this.state, ...{
      item: this.emptyItem,
    }};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    if (this.props.match.params.id !== 'new') {
      UserAPI.getUserByIdAsync(this.props.match.params.id, user => this.setState({item: user}), this.showError("get user info"));
    }
  }

  handleChange(event) {
    const {name, value} = event.target;
    let item = {...this.state.item};
    this.setInnerPropValue(item, name, value);
    item['coordinatedSubjects'] = []
    item['taughtCourses'] = []
    this.setState({item});
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
    UserAPI.postUserAsync(item, () => this.props.history.push('/users'), this.showError("save user"));
  }

  render() {
    const {item} = this.state;
    let newUser = this.props.match.params.id === 'new'
    const title = <h2 className="float-left">{!newUser ? 'Edit User' : 'Add User'}</h2>;
    return (
      <AppNavbar>
        {this.renderErrorModal()}
        <Container fluid>
          <Form onSubmit={this.handleSubmit}>
          <Row xs="2">
            <Col>{title}</Col>
            <Col>
              <ButtonGroup className="float-right">
                <SaveButton
                  entityId = {item.userId}
                  entityTypeCapName = "User"
                />
                {' '}
                <CancelButton
                  to = {"/users"}
                  entityTypeCapName = "User"
                />
              </ButtonGroup>
          </Col>
          </Row>
            <FormGroup>
              <Label for="shift">DNI Number</Label>
              <Input type="number"  min="0" max="2147483647" name="personalData.dni" id="dni" value={item.personalData.dni || ''}
                    onChange={this.handleChange} placeholder="DNI" required/>
            </FormGroup>
            <FormGroup>
              <Label for="shift">First Name</Label>
              <Input type="text" maxLength="50" name="personalData.firstName" id="firstName" value={item.personalData.firstName || ''}
                    onChange={this.handleChange} placeholder="First Name" required/>
            </FormGroup>
            <FormGroup>
              <Label for="shift">Last Name</Label>
              <Input type="text" maxLength="50" name="personalData.lastName" id="lastName" value={item.personalData.lastName || ''}
                    onChange={this.handleChange} placeholder="Last Name" required/>
            </FormGroup>
            <FormGroup>
              <Label for="shift">Mail</Label>
              <Input type="email" maxLength="50" name="personalData.email" id="email" value={item.personalData.email || ''}
                    onChange={this.handleChange} placeholder="e Mail" required/>
            </FormGroup>
            <FormGroup>
              <Label for="shift">Cell Phone</Label>
              <Input type="tel" name="personalData.cellPhone" id="cellPhone" value={item.personalData.cellPhone || ''}
                    title="Separar característica y número con un guión (no incluir 15 al inicio). Ej. 0229-4787658"
                    onChange={this.handleChange} placeholder="Cell Phone" pattern="\d{2,4}-\d{6,8}" required/>
            </FormGroup>
            <FormGroup>
              <Label for="shift">CUIT/CUIL</Label>
              <Input type="tel" name="jobDetail.cuitNumber" id="cuitNumber" value={item.jobDetail.cuitNumber || ''}
                    title="Separar con guiones. Ej. 20-12345678-3"
                    onChange={this.handleChange} placeholder="Cuit Number" pattern="\d{2}-\d{8}-\d" required/>
            </FormGroup>
            <FormGroup>
              <Label for="shift">Category</Label>
              <Input type="select" name="jobDetail.category" id="category" value={item.jobDetail.category || ''}
                    onChange={this.handleChange} placeholder="Category">
                    <option>Auxiliar</option>
                    <option>Instructor/a</option>
                    <option>Adjunto/a</option>
                    <option>Asociado/a</option>
                    <option>Titular</option>
                    <option>Emérito/a</option>
                    <option>Consulto/a</option>
              </Input>
              <UncontrolledTooltip placement="auto" target="category"> Select Category </UncontrolledTooltip>
            </FormGroup>
            <FormGroup>
              <Label for="shift">Grade</Label>
              <Input type="select" name="jobDetail.grade" id="grade" value={item.jobDetail.grade || ''}
                    onChange={this.handleChange} placeholder="Grade">
                    <option>A</option>
                    <option>B</option>
              </Input>
              <UncontrolledTooltip placement="auto" target="grade"> Select Grade </UncontrolledTooltip>
            </FormGroup>
            <FormGroup>
              <Label for="shift">Dedication</Label>
              <Input type="select" name="jobDetail.dedication" id="dedication" value={item.jobDetail.dedication || ''}
                    onChange={this.handleChange} placeholder="Dedication">
                    <option>Parcial</option>
                    <option>Semi Exclusiva</option>
                    <option>Exclusiva</option>
              </Input>
              <UncontrolledTooltip placement="auto" target="dedication"> Select Dedication </UncontrolledTooltip>
            </FormGroup>
            <FormGroup>
            <Label for="shift">Contract Relation</Label>
              <Input type="select" name="jobDetail.contractRelation" id="relation" value={item.jobDetail.contractRelation || ''}
                    onChange={this.handleChange} placeholder="Contract Relation">
                    <option>Contratado/a</option>
                    <option>Interino/a</option>
                    <option>Ordinario/a</option>
              </Input>
              <UncontrolledTooltip placement="auto" target="relation"> Select Contract Relation </UncontrolledTooltip>
            </FormGroup>
            <FormGroup>
              <Label for="shift">Aditional Hours</Label>
              <Input type="number" name="jobDetail.aditionalHours" id="aditional" value={item.jobDetail.aditionalHours || ''}
                    onChange={this.handleChange} placeholder="Aditional Hours"/>
            </FormGroup>
            <FormGroup>
              <Label for="shift">CV Link Relation</Label>
              <Input type="url" name="jobDetail.cvURL" id="cvUrl" value={item.jobDetail.cvURL || ''}
                    onChange={this.handleChange} placeholder="CV URL"/>
            </FormGroup>
            <FormGroup>
              <Label for="shift">Last CV Update</Label>
              <Input type="date" name="jobDetail.lastUpdate" id="update" value={item.jobDetail.lastUpdate || ''}
                    onChange={this.handleChange} placeholder="CV Last Update" disabled/>
            </FormGroup>
          </Form>
        </Container>
      </AppNavbar>
  )}
}

export default withRouter(UserEdit);