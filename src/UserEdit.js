import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Container, Form, FormGroup, Input, Label, ButtonGroup, UncontrolledTooltip } from 'reactstrap';
import AppNavbar from './AppNavbar';
import SaveButton from './buttonBar/SaveButton'
import CancelButton from './buttonBar/CancelButton'
import * as BackAPI from './BackAPI';

class UserEdit extends Component {

  emptyItem = {
    id: '',
    personalData: {
      dni: '',
      firstName: '',
      lastName: '',
      email: '',
      cellPhone: ''
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
      const user = BackAPI.getUserAsync(this.props.match.params.id, user => this.setState({item: user}), null) // TODO: replace null by error showing code
    }
  }

  handleChange(event) {
    const {name, value} = event.target;
    let item = {...this.state.item};
    if (name === "id") { item[name] = value; }
    else { item['personalData'][name] = value }
    item['attendedLessons'] = []
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
              entityId = {item.id}
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
            <Input type="number" name="id" id="number" value={item.id || ''}
                   onChange={this.handleChange} placeholder="File Number" disabled={!newUser}/>
        </FormGroup>
        <FormGroup>
            <Input type="number" name="dni" id="dni" value={item.personalData.dni || ''}
                   onChange={this.handleChange} placeholder="DNI"/>
        </FormGroup>
        <FormGroup>
            <Input type="text" name="firstName" id="firstName" value={item.personalData.firstName || ''}
                   onChange={this.handleChange} placeholder="First Name"/>
                           </FormGroup>
        <FormGroup>
            <Input type="text" name="lastName" id="lastName" value={item.personalData.lastName || ''}
                   onChange={this.handleChange} placeholder="Last Name"/>
        </FormGroup>
        <FormGroup>
            <Input type="text" name="email" id="email" value={item.personalData.email || ''}
                   onChange={this.handleChange} placeholder="e Mail"/>
        </FormGroup>
        <FormGroup>
            <Input type="number" name="cellPhone" id="cellPhone" value={item.personalData.cellPhone || ''}
                   onChange={this.handleChange} placeholder="Cell Phone"/>
        </FormGroup>

        </Form>
      </Container>
    </div>
  }
}

export default withRouter(UserEdit);