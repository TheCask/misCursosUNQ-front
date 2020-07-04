import React from 'react';
import { Button, UncontrolledTooltip } from 'reactstrap';
import { Link } from 'react-router-dom';
import getIcon from '../auxiliar/IconRepo'

const AddButton = (props) =>
    <Button 
            id={`add_${props.entityTypeCapName}`}
            color="success" 
            tag={Link} 
            to={props.to} 
            onClick={props.onClick} >
        <UncontrolledTooltip placement="auto" target={`add_${props.entityTypeCapName}`}>
                {`Add a ${props.entityTypeCapName}`}
        </UncontrolledTooltip>
        {getIcon('Add', props.entityTypeCapName)}
    </Button>;
export default AddButton;
