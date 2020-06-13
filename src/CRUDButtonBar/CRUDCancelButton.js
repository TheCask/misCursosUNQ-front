import React from 'react';
import { Button, UncontrolledTooltip } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const CRUDCancelButton = (props) =>
    /*
    Please provide this props:
        behavior = {onClick: myFunc},  // requires either {onClick: <myFunc>} or {to: <'/my/link'>' tag={Link}} 
        entityTypeCapName = 'Type',
        isDisabled = false   // OPTIONAL
    */
   <Button {...props.behavior}
            id='back'
            size="sm"
            color="secondary"
            disabled = {props.isDisabled || false} >
        <UncontrolledTooltip placement="auto" target='back' disabled = {props.isDisabled || false}>
            {"Discard and Go back"}
        </UncontrolledTooltip>
        <FontAwesomeIcon icon='backward' size="2x"/>
    </Button>;

export default CRUDCancelButton;