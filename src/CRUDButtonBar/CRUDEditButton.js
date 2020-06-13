import React from 'react';
import { Button, UncontrolledTooltip } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const CRUDEditButton = (props) => 
    /*
    Please provide this props:
        behavior = {onClick: myFunc},  // requires either {onClick: <myFunc>} or {to: <'/my/link'>' tag={Link}} 
        entityTypeCapName = 'Type',
        isDisabled = false
    */  
    <Button {...props.behavior}
            id={`edit_${props.entityTypeCapName}`}
            size="sm"
            color="primary"
            disabled = {props.isDisabled || false} >
        <UncontrolledTooltip placement="auto" target={`edit_${props.entityTypeCapName}`} disabled = {props.isDisabled || false} >
            {`Edit select ${props.entityTypeCapName}`}
        </UncontrolledTooltip>
        <FontAwesomeIcon icon='edit' size="2x"/>
    </Button>;

export default CRUDEditButton;
