/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const ListPickerModal = (props) => {
  const {
    className,
    title,
    list,
    currItem,
    itemDisplayFunc
  } = props;

  const [modal, setModal] = useState(false);
  //const [selectedId, setSelectedId] = useState(null);

  const toggle = () => setModal(!modal);

  const applyAndToggle = id => { 
    return () => {
      toggle(); 
      props.onItemClick(id)();
    }
  }


  return (
    <div>
      <Button key={currItem.lessonId} color="secondary" onClick={toggle}>{itemDisplayFunc(currItem)}</Button>
      <Modal isOpen={modal} toggle={toggle} className={className} modalTransition={{ timeout: 0 }} backdropTransition={{ timeout: 0 }}>
        <ModalHeader toggle={toggle}>{title}</ModalHeader>
        <ModalBody>
            {
              list.map( (item, index) => {
                return <Button key={item.lessonId} onClick={applyAndToggle(item.lessonId)}>{itemDisplayFunc(item)}</Button>
              })
            }
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );

  function renderListItems(){

  }
}



export default ListPickerModal;