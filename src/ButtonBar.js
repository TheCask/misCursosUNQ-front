import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table, UncontrolledTooltip,
  Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Log from './Log';


class ButtonBar extends Component {

  constructor(props) {
    super(props);
    this.state = {modal: false, modalTargetId: ''};
    this.toggleModal = this.toggleModal.bind(this);
    this.entityType = props.entityType;
  }

  toggleModal(e) {
    const modal = this.state.modal
    Log.info('modal ' + modal)
    this.setState({modal: !modal});
  }

  renderAddButton(){


  }

  render() {
    const targetId = this.props.targetId;
    const entityType =  this.entityType;
    const entityTypeCap = entityType.charAt(0).toUpperCase() + entityType.slice(1);

    return (
      <div className="float-right">
        <Button color="success" tag={Link} to={`/${this.entityType}/new`} id={`add${entityTypeCap}`}>
          <UncontrolledTooltip placement="auto" target={`add${entityTypeCap}`}>
            {`Add a ${entityTypeCap}`}
          </UncontrolledTooltip>
          <FontAwesomeIcon icon="user-graduate" size="1x"/>
          <FontAwesomeIcon icon="plus-circle" size="1x" transform="right-5 up-5"/>
        </Button>{' '}


        <ButtonGroup inline="true">
          <Button size="sm" color="primary" disabled={targetId === ''} tag={Link} to={`/${this.entityType}/${targetId}`} id={`edit_${targetId}`}>
            <UncontrolledTooltip placement="auto" target={`edit_${targetId}`}>
              {`Edit selected ${entityType}`}
            </UncontrolledTooltip>
            <FontAwesomeIcon icon={['fas', 'edit']} size="2x"/>
          </Button>  
          <Button size="sm" color="secondary" disabled={targetId === ''} tag={Link} to={`/${this.entityType}/${targetId}/detail`} id={`detail_${targetId}`}>
            <UncontrolledTooltip placement="auto" target={`detail_${targetId}`}>
            {`Selected ${entityType} details`}
            </UncontrolledTooltip>         
            <FontAwesomeIcon icon={['fas', 'info-circle']} size="2x"/>
          </Button>
          <Button size="sm" color="danger" disabled={targetId === ''} onClick={() => {this.setState({modalTargetId: targetId}); this.toggleModal()}} id={`delete_${targetId}`}>
            <UncontrolledTooltip placement="auto" target={`delete_${targetId}`}>
              {`Delete selected ${entityType}`}
            </UncontrolledTooltip>
            <FontAwesomeIcon icon={['fas', 'trash-alt']} size="2x"/>
          </Button>


          <Modal isOpen={this.state.modal} toggle={this.toggleModal} size="lg">
            <ModalHeader toggle={this.toggleModal}>
              <h3>{`You are about to delete selected ${entityType}. Are you sure?`}</h3>
            </ModalHeader>
            <ModalBody>
              <h4>This action will have the following consequences:</h4>
              <ul>
                {this.props.consequenceList.map(consequence => {
                  return (<li>{consequence}</li>
                  );
                })}

              </ul>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" onClick={() => {this.props.deleteEntityFunction(); this.toggleModal()}} id={"modalDelete"}>
                <UncontrolledTooltip placement="auto" target={"modalDelete"}>
                  YES, DELETE (I know what I'm doing)
                </UncontrolledTooltip>
                <FontAwesomeIcon icon={['fas', 'trash-alt']} size="2x"/>
              </Button>
              <Button color="secondary" onClick={this.toggleModal} id="modalCancel">
                <UncontrolledTooltip placement="auto" target="modalCancel">
                  Cancel
                </UncontrolledTooltip>
                <FontAwesomeIcon icon={['fas', 'backward']} size="2x"/>
              </Button>
            </ModalFooter>
          </Modal>
        </ButtonGroup>
      </div>
    )
  }
}

export default ButtonBar;