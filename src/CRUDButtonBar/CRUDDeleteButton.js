import React, {useState, useEffect} from 'react';
import { Button, UncontrolledTooltip, Modal, ModalHeader, ModalBody, ModalFooter, Form } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import getIcon from '../auxiliar/IconRepo';

export default function CRUDDeleteButton(props){
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

    function handleSubmit(event){
        props.behavior.onProceed(event, entity);
    }
      
    const aModal = <Modal isOpen={modal}  modalTransition={{ timeout: 0.3 }} //toggle={toggle}
        size="lg" returnFocusAfterClose={false}>
        <Form onSubmit={handleSubmit} >
            <ModalHeader>
                {`You are deleting a instance of ${props.entityTypeCapName}`}
            </ModalHeader>
            <ModalBody>
                <h4>Deleting will have the following consecuences.</h4>
                <ul>
                    {props.consequences.map( (c,i) => 
                        <li key={i}>{c}</li>    
                    )}
                </ul>
            </ModalBody>
            <ModalFooter>
                <Button color="danger" onClick={toggle}  id={"modalProceed"} type={"submit"} disabled={props.isDisabled}>
                    <UncontrolledTooltip placement="auto" target={"modalProceed"}>
                        Proceed, I know what I'm doing
                    </UncontrolledTooltip>
                    <FontAwesomeIcon icon='trash-alt' size="2x" />
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
                color={"danger"}
                disabled = {props.isDisabled || false}
                onClick = {() => {props.onClick(); toggle()}}
        >
            <UncontrolledTooltip placement="auto" target={`${props.operationType}_${props.entityTypeCapName}`}>
                {`Delete selected ${props.entityTypeCapName}`}
            </UncontrolledTooltip>
            {getIcon(props.operationType, props.entityTypeCapName)}
        </Button>
        {aModal}
    </div>);
}