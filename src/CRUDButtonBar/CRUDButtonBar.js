import React from 'react';
import { ButtonGroup } from 'reactstrap';
import CRUDAddButton from './CRUDButtonBar/CRUDAddButton';
import CRUDCancelButton from './CRUDButtonBar/CRUDDeleteButton';
import CRUDEditButton from './CRUDButtonBar/CRUDEditButton';
import CRUDDeleteButton from './CRUDButtonBar/CRUDDeleteButton';


export default function CRUDButtonBar (){
    /*
    Please include 

    */
    const propPack = {
        addButton: {
            behavior = {onClick: myFunc},  // requires either {onClick: <myFunc>} or {to: <'/my/link'>' tag={Link}} 
            entityTypeCapName = 'Type',
            isDisabled = false
        },
        cancelButton: {
            behavior = {onClick: myFunc},  // requires either {onClick: <myFunc>} or {to: <'/my/link'>' tag={Link}} 
            entityTypeCapName = 'Type',
            isDisabled = false
        },
        deleteButton: {
            behavior = {onClick: myFunc},  // requires either {onClick: <myFunc>} or {to: <'/my/link'>' tag={Link}} 
            entityTypeCapName = 'Type',
            isDisabled = false
        },
        editButton: {
            behavior = {onClick: myFunc},  // requires either {onClick: <myFunc>} or {to: <'/my/link'>' tag={Link}} 
            entityTypeCapName = 'Type',
            isDisabled = false
        },
        saveButton: {
            behavior = {onClick: myFunc},  // requires either {onClick: <myFunc>} or {to: <'/my/link'>' tag={Link}} 
            entityTypeCapName = 'Type',
            isDisabled = false
        }
    }

    const [currItem, setCurrItem] = useState(props.currItem);
    
    const keys = propPack.keys();
    
    return (
        <ButtonGroup>
            { keys.includes("addButton") ? <CRUDAddButton {...propPack.addButton}/> : <hr/> }
            { keys.includes("cancelButton") ? <CRUDCancelButton {...propPack.cancelButton}/> : <hr/> }
            { keys.includes("deleteButton") ? <CRUDDeleteButton {...propPack.deleteButton}/> : <hr/> }
            { keys.includes("editButton") ? <CRUDEditButton {...propPack.editButton}/> : <hr/> }
            { keys.includes("saveButton") ? <CRUDSaveButton {...propPack.saveButton}/> : <hr/> }
        </ButtonGroup>
    );




}