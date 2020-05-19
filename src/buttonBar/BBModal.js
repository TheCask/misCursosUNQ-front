import React, { Component } from 'react';
import { Button, UncontrolledTooltip, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const BBModal = props => 
    <Modal isOpen={props.isOpen()} 
           toggle={props.toggle} size="lg">
        <ModalHeader>
            <h3>{props.title}</h3>
        </ModalHeader>
        <ModalBody>
            {props.description}
        </ModalBody>
        <ModalFooter>
            <Button color="danger" onClick={props.onProceed} id={"modalProceed"}>
            <UncontrolledTooltip placement="auto" target={"modalProceed"}>
                {props.proceedTooltip}
            </UncontrolledTooltip>
            <FontAwesomeIcon icon={['fas', 'trash-alt']} size="2x"/>
            </Button>
            <Button color="secondary" onClick={props.toggle} id="modalCancel">
            <UncontrolledTooltip placement="auto" target="modalCancel">
                Cancel
            </UncontrolledTooltip>
            <FontAwesomeIcon icon={['fas', 'backward']} size="2x"/>
            </Button>
        </ModalFooter>
    </Modal>;
