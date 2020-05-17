import React from 'react';
import { Button, UncontrolledTooltip } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const AddButton = (props) => 
    <Button 
            id={`add_${props.entityTypeCapName}`}
            color="success" 
            tag={Link} 
            to={props.to} 
            onClick={props.onClick} >
        <UncontrolledTooltip placement="auto" 
            target={`add_${props.entityTypeCapName}`}>
                {`Add a ${props.entityTypeCapName}`}
        </UncontrolledTooltip>
        <FontAwesomeIcon icon="user-graduate" size="1x"/>
        <FontAwesomeIcon icon="plus-circle" size="1x" transform="right-5 up-5"/>
    </Button>;

export default AddButton;
