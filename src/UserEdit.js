import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Container, Form, FormGroup, Input, Label, ButtonGroup, UncontrolledTooltip } from 'reactstrap';
import AppNavbar from './AppNavbar';
import SaveButton from './buttonBar/SaveButton'
import CancelButton from './buttonBar/CancelButton'
import * as BackAPI from './BackAPI';

class UserEdit extends Component {

  emptyItem = {
      userId: '',
      personalData: {
          dni: '',
          firstName: '',
          lastName: '',
          email: '',
          cellPhone: '' 
      },
      jobDetail: {
          jobDetailId: '',
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
    this.state = {
      item: this.emptyItem,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    if (this.props.match.params.id !== 'new') {
      const user = BackAPI.getUserByIdAsync(this.props.match.params.id, user => this.setState({item: user}), null) // TODO: replace null by error showing code
    }
  }

  handleChange(event) {
    const {name, value} = event.target;
    const names = name.split(".")
    let item = {...this.state.item};
    if (names[2]) { item[names[0]][names[1]][names[2]] = value }
    else if (names[1]) { item[names[0]][names[1]] = value }
    else { item[name] = value; }
    item['coordinatedSubjects'] = []
    item['taughtCourses'] = []
    this.setState({item});
  }

  async handleSubmit(event) {
    event.preventDefault();
    const {item} = this.state;
    BackAPI.postUserAsync(item, () => this.props.history.push('/users'), null); // TODO: replace null by error showing code
  }

  render() {
    const {item} = this.state;
    let newUser = this.props.match.params.id === 'new'
    const title = <h2 className="float-left">{!newUser ? 'Edit User' : 'Add User'}</h2>;
    return <div>
      <AppNavbar/>
      <Container fluid>
        <Form onSubmit={this.handleSubmit}>
        {title}
        <FormGroup className="float-right">
          <ButtonGroup>
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
        </FormGroup>
          <FormGroup>
            <Input type="number" name="personalData.dni" id="dni" value={item.personalData.dni || ''}
                   onChange={this.handleChange} placeholder="DNI" required/>
          </FormGroup>
          <FormGroup>
            <Input type="text" name="personalData.firstName" id="firstName" value={item.personalData.firstName || ''}
                   onChange={this.handleChange} placeholder="First Name" required/>
          </FormGroup>
          <FormGroup>
            <Input type="text" name="personalData.lastName" id="lastName" value={item.personalData.lastName || ''}
                   onChange={this.handleChange} placeholder="Last Name" required/>
          </FormGroup>
          <FormGroup>
            <Input type="text" name="personalData.email" id="email" value={item.personalData.email || ''}
                   onChange={this.handleChange} placeholder="e Mail" required/>
          </FormGroup>
          <FormGroup>
            <Input type="number" name="personalData.cellPhone" id="cellPhone" value={item.personalData.cellPhone || ''}
                   onChange={this.handleChange} placeholder="Cell Phone"/>
          </FormGroup>
          <FormGroup>
            <Input type="number" name="jobDetail.cuitNumber" id="cuitNumber" value={item.jobDetail.cuitNumber || ''}
                   onChange={this.handleChange} placeholder="Cuit Number"/>
          </FormGroup>
          <FormGroup>
            <Input type="text" name="jobDetail.category" id="category" value={item.jobDetail.category || ''}
                   onChange={this.handleChange} placeholder="Category"/>
          </FormGroup>
          <FormGroup>
            <Input type="text" name="jobDetail.grade" id="grade" value={item.jobDetail.grade || ''}
                   onChange={this.handleChange} placeholder="Grade"/>
          </FormGroup>
          <FormGroup>
            <Input type="text" name="jobDetail.dedication" id="detication" value={item.jobDetail.dedication || ''}
                   onChange={this.handleChange} placeholder="Dedication"/>
          </FormGroup>
          <FormGroup>
            <Input type="text" name="jobDetail.contractRelation" id="relation" value={item.jobDetail.contractRelation || ''}
                   onChange={this.handleChange} placeholder="Contract Relation"/>
          </FormGroup>
          <FormGroup>
            <Input type="number" name="jobDetail.aditionalHours" id="aditional" value={item.jobDetail.aditionalHours || ''}
                   onChange={this.handleChange} placeholder="Aditional Hours"/>
          </FormGroup>
          <FormGroup>
            <Input type="text" name="jobDetail.cvURL" id="cvUrl" value={item.jobDetail.cvURL || ''}
                   onChange={this.handleChange} placeholder="CV URL"/>
          </FormGroup>
          <FormGroup>
            <Input type="date" name="jobDetail.lastUpdate" id="update" value={item.jobDetail.lastUpdate || ''}
                   onChange={this.handleChange} placeholder="CV Last Update"/>
          </FormGroup>
        </Form>
      </Container>
    </div>
  }
}

export default withRouter(UserEdit);