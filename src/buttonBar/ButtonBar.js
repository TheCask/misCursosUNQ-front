import React, { Component } from 'react';
import { ButtonGroup } from 'reactstrap';
import AddButton from './AddButton';
import EditButton from './EditButton';
import DetailButton from './DetailButton';
import DeleteButton from './DeleteButton';
import { BBModal } from './BBModal';

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

          <BBModal 
            isOpen = {() => this.state.modal}
            toggle = {this.toggleModal}
            title = {`You are about to delete selected ${entityType}. Are you sure?`}
            onProceed = {() => {this.props.deleteEntityFunction(); this.disableButtonAvailability(); this.toggleModal(); }}
            proceedTooltip = {"YES, DELETE (I know what I'm doing)"}
            description = {
              <div>
                <h4>This action will have the following consequences:</h4>
                <ul>
                  {this.props.consequenceList.map( (consequence, index) => {
                    return (<li key = {index}>{consequence}</li>);
                  })}
                </ul>
              </div>
            }
          />          
        </ButtonGroup>
      </div>
    )
  }
}

export default ButtonBar;