import React, { useState } from 'react';
import { Collapse, Button, CardBody, Card } from 'reactstrap';

export default function Collapsable (props) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <Button color="primary" onClick={toggle} style={{ marginBottom: '1rem' }}>{`${isOpen ? 'Show ' : 'Hide '} ${props.entityTypeCapName}`}</Button>
      <Collapse isOpen={isOpen}>
        {this.props.children}
      </Collapse>
    </div>
  );
}