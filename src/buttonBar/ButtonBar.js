import React, { Component } from 'react';
import { Button, ButtonGroup, UncontrolledTooltip, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AddButton from './AddButton';
import EditButton from './EditButton';
import DetailButton from './DetailButton';
import DeleteButton from './DeleteButton';

class ButtonBar extends Component {

  constructor(props) {
    super(props);
    this.state = {modal: false, modalTargetId: ''};
    this.toggleModal = this.toggleModal.bind(this);
    this.disableButtonAvailability = this.disableButtonAvailability.bind(this);
    this.entityType = props.entityType;
  }

  toggleModal(e) {
    const modal = this.state.modal
    this.setState({modal: !modal});
  }

  disableButtonAvailability(){
    this.setState({modalTargetId: ''});
  }

  render() {
    const targetId = this.props.targetId;
    const entityType =  this.entityType;
    const entityTypeCap = entityType.charAt(0).toUpperCase() + entityType.slice(1);

    return (
      <div className="float-right">
        <AddButton
                entityTypeCapName = {entityTypeCap}
                to = {`/${entityType}/new`} />
        {' '}
        <ButtonGroup inline="true">

          <EditButton
                  entityTypeCapName = {entityTypeCap}
                  targetId = {targetId}
                  to = {`/${entityType}/${targetId}`} />
          <DetailButton
                  entityTypeCapName = {entityTypeCap}
                  targetId = {targetId}
                  to = {`/${entityType}/${targetId}/detail`} />
          <DeleteButton
                  entityTypeCapName = {entityTypeCap}
                  targetId = {targetId}
                  onClick = {() => {this.setState({modalTargetId: targetId}); this.toggleModal()}} />

          <Modal isOpen={this.state.modal} toggle={this.toggleModal} size="lg">
            <ModalHeader toggle={this.toggleModal}>
                <h3>{`You are about to delete selected ${entityType}. Are you sure?`}</h3>
            </ModalHeader>
            <ModalBody>
                <h4>This action will have the following consequences:</h4>
                <ul>
                {this.props.consequenceList.map(consequence => {
                    return (<li>{consequence}</li>);
                })}
                </ul>
            </ModalBody>
            <ModalFooter>
                <Button color="danger" onClick={() => {this.props.deleteEntityFunction(); this.disableButtonAvailability(); this.toggleModal(); }} id={"modalDelete"}>
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