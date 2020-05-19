import React from 'react';
import { Button, UncontrolledTooltip } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const SaveButton = (props) =>
    <Button size="sm" color="primary" type="submit" id="saveEntity">
        <UncontrolledTooltip placement="auto" target="saveEntity">
            {props.entityId ? 'Save Changes' : `Save New ${props.entityTypeCapName}`}
        </UncontrolledTooltip>
        <FontAwesomeIcon icon={['fas', 'save']} size="2x" />
    </Button>;

export default SaveButton;