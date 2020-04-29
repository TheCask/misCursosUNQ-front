import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class AppSpinner extends Component {
    render() {
        return (
            <span className="fa-layers fa-fw">
              <FontAwesomeIcon icon="atom" color="darkred" size="6x" className="appSpinner"
                transform="right-100 down-50" spin />
            </span>)
    }
}
export default AppSpinner;