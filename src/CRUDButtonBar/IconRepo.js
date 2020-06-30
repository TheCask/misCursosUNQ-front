import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function getIcon(operationType, entityTypeCapName) {
    
    switch(operationType) {

        case 'Add' : 

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
                default: return (<FontAwesomeIcon icon='plus-circle' size="2x" style={{ width: "1em"}}/>)
            }

        case 'Edit' :

            switch (entityTypeCapName) {

                default : return <FontAwesomeIcon icon='edit' size="2x" style={{ width: "1em"}}/>
            }

        default : return (<FontAwesomeIcon icon='plus-circle' size="2x" style={{ width: "1em"}}/>)

    }
}