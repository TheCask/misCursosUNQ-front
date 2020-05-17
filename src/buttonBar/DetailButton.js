import React from 'react';
import { Button, UncontrolledTooltip } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const EditButton = (props) => 
    <Button 
            id={`detail_${props.entityTypeCapName}`}
            color="secondary"
            size="sm"
            disabled = {props.targetId === ''}
            tag={Link}
            to={props.to} 
            onClick={props.onClick} >
        <UncontrolledTooltip placement="auto" target={`detail_${props.entityTypeCapName}`}>
                {`Details on selected ${props.entityTypeCapName}`}
        </UncontrolledTooltip>
        <FontAwesomeIcon icon={['fas', 'info-circle']} size="2x"/>
    </Button>;

export default EditButton;
