import React from 'react';
import { Button, UncontrolledTooltip } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const CRUDDeleteButton = (props) =>
    /*
    Please provide this props:
        behavior = {onClick: myFunc},  // requires either {onClick: <myFunc>} or {to: <'/my/link'>' tag={Link}} 
        entityTypeCapName = 'Type',
        isDisabled = false
    */  
    <Button {...props.behavior}
            id={`delete_${props.entityTypeCapName}`}
            size="sm"
            color="danger"
            disabled = {props.isDisabled || false} >
        <UncontrolledTooltip placement="auto" target={`delete_${props.entityTypeCapName}`} disabled = {props.isDisabled || false} >
            {`Delete selected ${props.entityTypeCapName}`}
        </UncontrolledTooltip>
        <FontAwesomeIcon icon='trash-alt' size="2x"/>
    </Button>;

export default CRUDDeleteButton;