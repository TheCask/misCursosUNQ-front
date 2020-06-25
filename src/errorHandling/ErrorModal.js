import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';


export default function ErrorModal (props) {

    const [isDetailShown, setDetailShown] = useState(false);
    const {title, shortDesc, httpCode, errorText} = props.lastError; 
    
    const toggleShowDetails = () => setDetailShown(!isDetailShown);

    const details = () => 
        <div> 
            <hr/>
            <p>{httpCode}</p>
            <p>{errorText}</p>
        </div>;


    return <Modal isOpen={props.isOpen()} modalTransition={{ timeout: 1 }}
            toggle={props.toggle} size="lg" returnFocusAfterClose={false}>
            <ModalHeader>
                {title}
            </ModalHeader>
            <ModalBody>
                {shortDesc}
                {isDetailShown ? details() : null }
            </ModalBody>
            <ModalFooter>
                <Button color={httpCode === '200' ? 'success' : 'danger' } onClick={() => {props.toggle(); toggleShowDetails()}} id="modalCancel">
                    OK
                </Button>
                <Button color="secondary" onClick={toggleShowDetails} id="modalCancel">
                    Show Details
                </Button>
            </ModalFooter>
        </Modal>;
}