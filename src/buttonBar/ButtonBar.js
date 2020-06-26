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
    this.addButtonTo = props.addButtonTo;
    this.renderAddButton = props.renderAddButton;
    this.renderDeleteButton = props.renderDeleteButton;
    this.renderEditButton = props.renderEditButton;
    this.renderAddAndDeleteButtons = props.renderAddAndDeleteButtons;
    this.deleteButtonTo = props.deleteButtonTo;
  }

  toggleModal(e) {
    const modal = this.state.modal
    this.setState({modal: !modal});
  }

  disableButtonAvailability(){
    this.setState({modalTargetId: ''});
  }

  routeTo(name) {
    switch (name) {
      case 'teacher': return 'user'
      case 'coordinator': return 'user'
      default: return name
    }
  }

  render() {
    const targetId = this.props.targetId;
    const entityType =  this.entityType;
    const route = this.routeTo(entityType)
    const entityTypeCap = entityType.charAt(0).toUpperCase() + entityType.slice(1);
    return (
      <div className="float-right">
        <ButtonGroup inline="true">
          {this.renderAddButton ?
          <AddButton 
            entityTypeCapName = {entityTypeCap} 
            to = {this.addButtonTo} />
            : null
          }
          {this.renderEditButton ?
          <EditButton
            entityTypeCapName = {entityTypeCap}
            targetId = {targetId}
            to = {`/${route}/${targetId}`} />
            : null
          }
          <DetailButton
            entityTypeCapName = {entityTypeCap}
            targetId = {targetId}
            to = {`/${route}/${targetId}/detail`} />
          {this.renderDeleteButton ?
          <DeleteButton
            entityTypeCapName = {entityTypeCap}
            targetId = {targetId}
            onClick = {() => {this.setState({modalTargetId: targetId}); this.toggleModal()}} 
            to = {this.deleteButtonTo}/>
            : null
          }
          <BBModal
            fade={false}
            isOpen = {() => this.state.modal}
            toggle = {this.toggleModal}
            onProceed = {() => {this.props.deleteEntityFunction(); this.disableButtonAvailability(); this.toggleModal(); }}
            proceedTooltip = {"YES, DELETE (I know what I'm doing)"}
            disallowDelete = {this.props.disallowDelete}
            
            title = { this.props.disallowDelete ? this.props.onDisableDeleteTitle : `You are about to delete selected ${entityType}. Are you sure?` }
            description = { this.props.disallowDelete ? this.props.onDisableDeleteBody : 
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