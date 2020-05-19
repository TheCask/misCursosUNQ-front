import React from 'react';
import { Button, UncontrolledTooltip } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const CancelButton = (props) =>
    <Button size="sm" color="secondary" tag={Link} to = {props.to} id = {`backTo${props.entityTypeCapName}s`} >
        <UncontrolledTooltip placement="auto" target = {`backTo${props.entityTypeCapName}s`}>
            {`Discard and Back to ${props.entityTypeCapName}s`}
        </UncontrolledTooltip>
        <FontAwesomeIcon icon={['fas', 'backward']} size="2x"/>
    </Button>

export default CancelButton;