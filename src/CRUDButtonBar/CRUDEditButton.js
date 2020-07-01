import React, {useState, useEffect} from 'react';
import { Button, UncontrolledTooltip, Modal, ModalHeader, ModalBody, ModalFooter, Form, Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import getIcon from '../auxiliar/IconRepo';

export default function CRUDEditButton(props){
    /*
    Please provide this props:
        behavior = {onProceed: myFunc},  // requires either {onClick: <myFunc>} or {to: <'/my/link'>' tag={Link}} 
        entityTypeCapName = 'Type',
        isDisabled = false
        getEntity = getFunc
    */
    const [modal, setModal] = useState(false);
    const [entity, setEntity] = useState(props.getEntity)

    useEffect( () =>
        setEntity(props.getEntity), [props]
    )

    const toggle = () => {setModal(!modal)};

    function handleChange(event){
        setEntity({...entity, instanceName: event.target.value});
    }

    function handleSubmit(event){
        props.behavior.onProceed(event, entity);
    }
      
    const aModal = <Modal isOpen={modal}  modalTransition={{ timeout: 0.3 }} //toggle={toggle}
        size="lg" returnFocusAfterClose={false}>
        <Form onSubmit={handleSubmit} >
            <ModalHeader>
                Give a name to your new evaluation instance
            </ModalHeader>
            <ModalBody>
                <Input id={props.getEntity.evaluationId || 'new'} name={"instanceName"} value={entity.instanceName} onChange={handleChange} autoFocus={true} />
            </ModalBody>
            <ModalFooter>
                <Button color="success" onClick={toggle}  id={"modalProceed"} type={"submit"} disabled={props.isDisabled}>
                    <UncontrolledTooltip placement="auto" target={"modalProceed"}>
                        Save
                    </UncontrolledTooltip>
                    <FontAwesomeIcon icon='save' size="2x" />
                </Button>
                <Button color="secondary" onClick={toggle} id="modalCancel">
                    <UncontrolledTooltip placement="auto" target="modalCancel">
                        Cancel
                    </UncontrolledTooltip>
                    <FontAwesomeIcon icon={['fas', 'backward']} size="2x" />
                </Button>
            </ModalFooter>
        </Form>
    </Modal>;


   return (
   <div>
        <Button 
                id={`${props.operationType}_${props.entityTypeCapName}`}
                size="sm"
                color={props.operationType === 'Add' ? "success" : "primary"}
                disabled = {props.isDisabled || false}
                onClick = {() => {props.onClick(); toggle()}}
        >
            <UncontrolledTooltip placement="auto" target={`${props.operationType}_${props.entityTypeCapName}`}>
                    {`${props.operationType} ${props.entityTypeCapName}`}
            </UncontrolledTooltip>
            {getIcon(props.operationType, props.entityTypeCapName)}
        </Button>
        {aModal}
    </div>);
}