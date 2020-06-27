import React from 'react';
import { Button, UncontrolledTooltip } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const CancelButton = (props) =>
    props.to ? 
    <Button size="sm" color="secondary" tag={Link} to ={props.to} id ={`backTo${props.entityTypeCapName}s`} >
        <UncontrolledTooltip placement="auto" target = {`backTo${props.entityTypeCapName}s`}>
            {props.entityTypeCapName ? `Discard and Back to ${props.entityTypeCapName}s` : 'Discard and go Back'}
        </UncontrolledTooltip>
        <FontAwesomeIcon icon='backward' size="2x"/>
    </Button>
    :
    <Button size="sm" color="secondary" id ={`backTo${props.entityTypeCapName}s`} onClick={props.onClick}>
        <UncontrolledTooltip placement="auto" target = {`backTo${props.entityTypeCapName}s`}>
            Discard and go Back
        </UncontrolledTooltip>
        <FontAwesomeIcon icon='backward' size="2x"/>
    </Button>

export default CancelButton;