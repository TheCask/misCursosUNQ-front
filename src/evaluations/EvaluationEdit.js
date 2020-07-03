import React, { useState } from 'react';
import {  Input, InputGroup, InputGroupAddon,ButtonGroup, Badge} from 'reactstrap';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import { Button, Table } from 'reactstrap';
import Log from '../auxiliar/Log';
import CRUDEditButton from '../CRUDButtonBar/CRUDEditButton';
import CRUDDeleteButton from '../CRUDButtonBar/CRUDDeleteButton';
import * as CourseAPI from '../services/CourseAPI';


export default function EvaluationEdit(props){

    const [filterValue, setFilterValue] = useState('');

    function newEvalInstance() {
        return {
            evaluationId: '',
            instanceName: 'TP ',
            califications: []
        }
    }

    Log.info("EvaEdit");

    /* useEffect(() => {
        setEvaluations(props.evaluations);
    }, [props.evaluations]); */

    function setRowColor (itemId) {
        if (props.currEvalInstance.evaluationId === itemId) {
        return {backgroundColor:'#F0FFF0'}
        }
    }

    function onClickFunc(evalId){
        return () => {
            props.onSelectFunc(evalId);
        }
    }

    function handleEvalSubmit(event, evalInstance) {
        event.preventDefault();
        CourseAPI.postCourseEvaluationAsync(
            props.courseId, 
            evalInstance, 
            (res) => {
                Log.info(res, "POST SUCCEDED");
                props.reloadCourse();     /// NEEDED??????
            }, 
            props.showError("save evaluation"));
    }

    function handleEvalDelete(event, evalInstance) {
        event.preventDefault();
        CourseAPI.deleteCourseEvaluationAsync(
            evalInstance.evaluationId, 
            (res) => {
                Log.info(res, "DELETE SUCCEDED");
                props.reloadCourse();     /// NEEDED??????
            }, 
            props.showError("delete evaluation"));
    }

    function getInnerPropValue(baseObj, subPropString){
        const subProps = subPropString.split(".");
        const lastPropName = subProps.pop(); // elimina del array y retorna el ultimo 
        let propRef = baseObj;
        subProps.forEach(subprop => {
          propRef = propRef[subprop];
        });
        return propRef[lastPropName];
    }

    function isEvalSelected() { 
        return props.currEvalInstance && props.currEvalInstance.evaluationId !== '';
    }

    const tableRender = (evalList) => {

        const filteredFields = ["instanceName"];
        let filteredList = evalList;
        if (filterValue !== '')
            filteredList = evalList.filter( ev => 
                filteredFields.some( k => {
                    Log.info(getInnerPropValue(ev, k), "getInnerPropValue(ev, k)");
                    return getInnerPropValue(ev, k) ? getInnerPropValue(ev, k).toString().toLowerCase().includes(filterValue.toLowerCase()) : false
                
                })             
        )

        function isValidNote(note){
            return note && !isNaN(note);
        }

        function countValidNotes(califications){
            return califications.reduce((acc, currCal)=> isValidNote(currCal.note) ? (acc + 1) : acc, 0)
        }

        function sumValidNotes(califications){
            return califications.reduce((acc, currCal)=> isValidNote(currCal.note) ? (acc + currCal.note) : acc, 0)
        }

        function avgValidNotes(califications){
            return (sumValidNotes(califications)/countValidNotes(califications)).toFixed(1)
        }

        const tdStyle = {whiteSpace: 'nowrap', textAlign: 'center'};

        return (
            <Table hover className="mt-4" >
                <thead>
                    <tr>
                        <th width="100%">Instance Name</th>
                        <th {...tdStyle} width="100%">Average</th>
                        <th {...tdStyle} width="100%">Califs.</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredList.map( (ev, index) => 
                        <tr style={setRowColor(ev.evaluationId)}
                            key={index} 
                            id={ev.evaluationId} 
                            onClick={onClickFunc(ev.evaluationId)} 
                        >
                            <td style={{whiteSpace: 'nowrap'}}>{ev.instanceName || ''}</td>
                            <td style={tdStyle}>
                                {avgValidNotes(ev.califications)}
                            </td>
                            <td style={tdStyle}>
                                <Badge color="primary" pill>
                                    {`${countValidNotes(ev.califications)}/${ev.califications.length}`}
                                </Badge>
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>)
    };

    return (
        <>
        <Row>
            <Col md={9}>
                <InputGroup>
                    <Input 
                        placeholder={"Search evaluation by name"} 
                        value={filterValue} 
                        onChange={(event) => setFilterValue(event.target.value)} 
                        disabled = {props.evaluations.length === 0}
                        />
                    <InputGroupAddon addonType="append">
                        <Button color="secondary" onClick={() => setFilterValue('')} >Clear</Button>
                    </InputGroupAddon>
                </InputGroup>
            </Col>
            <Col>
                <ButtonGroup style={{ padding: "0em", float: "right"}}>
                    <CRUDEditButton 
                        operationType='Add'
                        behavior = {{ onProceed: handleEvalSubmit }}  // requires either {onClick: <myFunc>} or {to: <'/my/link'>' tag={Link}} 
                        onClick = {() => {}}
                        entityTypeCapName = {'Evaluation'}
                        isDisabled = {false}
                        getEntity = {newEvalInstance()}
                        />
                    <CRUDEditButton 
                        operationType='Edit'
                        behavior = {{ onProceed: handleEvalSubmit }}  // requires either {onClick: <myFunc>} or {to: <'/my/link'>' tag={Link}} 
                        onClick = {() => {}}
                        entityTypeCapName = {'Evaluation'}
                        isDisabled = {!isEvalSelected()}
                        getEntity = {props.currEvalInstance}
                        />
                    <CRUDDeleteButton
                        operationType='Delete'
                        behavior = {{ onProceed: handleEvalDelete }}  // requires either {onClick: <myFunc>} or {to: <'/my/link'>' tag={Link}} 
                        onClick = {() => {}}
                        entityTypeCapName = {'Evaluation'}
                        consequences={['Every student calification corresponding to this evaluation instance will be permanently deleted.', "This evaluation will be deleted."]}
                        isDisabled = {!isEvalSelected()}
                        getEntity = {props.currEvalInstance}
                        />
                </ButtonGroup>
            </Col>
        </Row>






        
        {/* <EvaluationPicker 
            evaluations = {currCourse.evaluations}
            onSelectFunc = {setCurrEvalInstanceById}
            currEvalInstance = {currEvalInstance}
            /> */}

        {tableRender(props.evaluations)}
        </>
    )
}