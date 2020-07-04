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
            
        case 'Delete' :

            switch (entityTypeCapName) {

                default : return <FontAwesomeIcon icon='trash-alt' size="2x"/>
            }

        default : return (<FontAwesomeIcon icon='plus-circle' size="2x" style={{ width: "1em"}}/>)

    }
}

export function getCourseIcon(subjectCode) {
    switch(subjectCode.split("-")[0]) {
    case "80000":
        return (<> <FontAwesomeIcon icon='book' size="1x" color="darkred" transform="left-10 up-10"/>
                <FontAwesomeIcon icon='book-reader' size="1x" color="darkred" transform="right-10 up-10"/>
                <FontAwesomeIcon icon='pencil-alt' size="1x" color="darkred" transform="left-10 down-10"/>
                <FontAwesomeIcon icon='graduation-cap' size="1x" color="darkred" transform="right-10 down-10"/> </>);
    case "80005":
        return (<> <FontAwesomeIcon icon='bug' size="1x" color="black" transform="left-10 up-10"/>
                <FontAwesomeIcon icon='microchip' size="1x" color="black" transform="right-10 up-10"/>
                <FontAwesomeIcon icon='laptop-code' size="1x" color="black" transform="left-10 down-10"/>
                <FontAwesomeIcon icon='project-diagram' size="1x" color="black" transform="right-10 down-10"/> </>);
    case "80003":
        return (<> <FontAwesomeIcon icon='brain' size="1x" color="darkblue" transform="left-10 up-10"/>
                <FontAwesomeIcon icon='shapes' size="1x" color="darkblue" transform="right-10 up-10"/>
                <FontAwesomeIcon icon='infinity' size="1x" color="darkblue" transform="left-10 down-10"/>
                <FontAwesomeIcon icon='calculator' size="1x" color="darkblue" transform="right-10 down-10"/> </>);
    case "80004":
        return (<> <FontAwesomeIcon icon='thermometer-half' size="1x" color="darkgreen" transform="left-10 up-10"/>
                <FontAwesomeIcon icon='atom' size="1x" color="darkgreen" transform="right-10 up-10"/>
                <FontAwesomeIcon icon='flask' size="1x" color="darkgreen" transform="left-10 down-10"/>
                <FontAwesomeIcon icon='magnet' size="1x" color="darkgreen" transform="right-10 down-10"/> </>);
    default: return <FontAwesomeIcon icon={['fas', 'chalkboard']} size="2x" color="gray"/>
    }
}