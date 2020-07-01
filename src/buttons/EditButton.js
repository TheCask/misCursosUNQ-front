import React from 'react';
import { Button, UncontrolledTooltip } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const EditButton = (props) => 
    <Button 
            id={`edit_${props.entityTypeCapName}`}
            color="primary"
            size="sm"
            disabled = {props.targetId === ''}
            tag={Link}
            to={props.to} 
            onClick={props.onClick} >
        <UncontrolledTooltip placement="auto" target={`edit_${props.entityTypeCapName}`} disabled = {props.targetId === ''} >
                {`Edit select ${props.entityTypeCapName}`}
        </UncontrolledTooltip>
        <FontAwesomeIcon icon='edit' size="2x"/>
    </Button>;

export default EditButton;
