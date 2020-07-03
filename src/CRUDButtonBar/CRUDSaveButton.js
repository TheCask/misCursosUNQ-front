import React from 'react';
import { Button, UncontrolledTooltip } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const CRUDSaveButton = (props) =>
    /*
    Please provide this props:
        behavior = {onClick: myFunc},  // requires either {onClick: <myFunc>} or {to: <'/my/link'>' tag={Link}} 
        entityTypeCapName = 'Type',
        isDisabled = false
    */
    <Button {...props.behavior}
            id={`save_${props.entityTypeCapName}`}
            size="sm" 
            color="primary"
            type="submit"
            disabled = {props.isDisabled || false} 
            tabIndex={0}
            >
        <UncontrolledTooltip placement="auto" target={`save_${props.entityTypeCapName}`}>
            {`Save ${props.entityTypeCapName}`}
        </UncontrolledTooltip>
        <FontAwesomeIcon icon='save' size="2x" />
    </Button>;

export default CRUDSaveButton;