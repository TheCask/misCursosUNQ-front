import React from 'react';
import { Button, UncontrolledTooltip } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const DeleteButton = (props) =>
    <Button 
            id={`delete_${props.entityTypeCapName}`}
            color="danger"
            size="sm"
            disabled = {props.targetId === ''}
            tag={Link}
            to={props.to}
            onClick={props.onClick} >
        <UncontrolledTooltip placement="auto" target={`delete_${props.entityTypeCapName}`} disabled = {props.targetId === ''} >
                {`Delete selected ${props.entityTypeCapName}`}
        </UncontrolledTooltip>
        <FontAwesomeIcon icon={['fas', 'trash-alt']} size="2x"/>
    </Button>;

export default DeleteButton;