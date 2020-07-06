import React, { useState } from 'react';
import { Collapse, Button } from 'reactstrap';

export default function Collapsable (props) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => { setIsOpen(!isOpen); }

  return (
    <div>
      <Button color={props.color || "primary"} onClick={toggle} 
        style={{ marginBottom: '1rem' }} disabled={props.disabled || false}>
        {`${isOpen ? 'Hide ' : 'Show '} ${props.entityTypeCapName}`}
      </Button>
      <Collapse isOpen={isOpen}>
        {props.children}
      </Collapse>
    </div>
  );
}