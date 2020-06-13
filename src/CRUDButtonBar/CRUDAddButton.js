import React from 'react';
import { Button, UncontrolledTooltip } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const CRUDAddButton = (props) =>
    /*
    Please provide this props:
        behavior = {onClick: myFunc},  // requires either {onClick: <myFunc>} or {to: <'/my/link'>' tag={Link}} 
        entityTypeCapName = 'Type',
        isDisabled = false
    */
    <Button {...props.behavior}
            id={`add_${props.entityTypeCapName}`}
            size="sm"
            color="success"
            disabled = {props.isDisabled || false} >
        <UncontrolledTooltip placement="auto" target={`add_${props.entityTypeCapName}`}>
                {`Add new ${props.entityTypeCapName}`}
        </UncontrolledTooltip>
        {icon(props.entityTypeCapName)}
    </Button>;

function icon(entityTypeCapName) {
    switch (entityTypeCapName) {
        case 'User': return ( <span>
            <FontAwesomeIcon icon="chalkboard-teacher" size="1x"/>
            <FontAwesomeIcon icon="plus-circle" size="1x" transform="right-5 up-5"/>
        </span> )
        case 'Teacher': return ( <span>
            <FontAwesomeIcon icon="chalkboard-teacher" size="1x"/>
            <FontAwesomeIcon icon="plus-circle" size="1x" transform="right-5 up-5"/>
        </span> )
        case 'Coordinator': return ( <span>
            <FontAwesomeIcon icon="chalkboard-teacher" size="1x"/>
            <FontAwesomeIcon icon="plus-circle" size="1x" transform="right-5 up-5"/>
        </span> )
        case 'Student': return ( <span>
            <FontAwesomeIcon icon="user-graduate" size="1x"/>
            <FontAwesomeIcon icon="plus-circle" size="1x" transform="right-5 up-5"/>
        </span> )
        case 'Subject': return ( <span>
            <FontAwesomeIcon icon="university" size="1x"/>
            <FontAwesomeIcon icon="plus-circle" size="1x" transform="right-5 up-5"/>
        </span> )
        case 'Course': return ( <span>
            <FontAwesomeIcon icon="chalkboard" size="1x"/>
            <FontAwesomeIcon icon="plus-circle" size="1x" transform="right-5 up-5"/>
        </span> )
        default: return (<FontAwesomeIcon icon='plus' size="1x"/>)
    }
}
export default CRUDAddButton;
