import React, { useState, useEffect } from 'react';
import { Input, Table, Form, ButtonGroup, InputGroup, InputGroupAddon, Button, Row, Col} from 'reactstrap';
import CRUDSaveButton from './CRUDButtonBar/CRUDSaveButton';
import * as CourseAPI from './services/CourseAPI';
import Log from './Log';


export default function CalificationEdit(props){
    
    const [dirty, setDirty] = useState(false)
    const [califificationFullList, setCalifFullList] = useState([]) 
    const [filterValue, setFilterValue] = useState('');

    Log.info(califificationFullList, "Calification Picker")

    useEffect(() => {
        if (props.currEvalInstance){
            setCalifFullList(createCalifFullList(props.students, props.currEvalInstance.califications))
        }
    }, [props.currEvalInstance])

    function handleNoteChange(event){
        setDirty(true);
        const newNote = event.target.value;
        setCalifFullList(califificationFullList.map( cal => 
            cal.student.fileNumber === parseInt(event.target.name) ? {...cal, note: newNote} :  cal))
    }

    function createCalifFullList(students, califications){
        // Uses student list and existing califications to create califications for all students
        if (props.currEvalInstance){
            const sl = students.map( st => {
                const calificationFound = califications.find( cal => cal.student.fileNumber === st.fileNumber);
                return ( populateCalif(st, calificationFound));
            })
            return sl;
        }    
        else {
            return [];
        }
    }

    function populateCalif (st, cal){
        if (cal){
            cal.student = st
            return cal;
        } else{
            return {
                calificationId: '',
                student: { ...st},
                note: ''
            }
        }
    }

    function onSaveCalifications(event){
        event.preventDefault()
        Log.info("Saving califications...........")
        const evalWithCalifications = {...props.currEvalInstance, califications: califificationFullList}
        CourseAPI.postCourseEvaluationAsync(
            props.courseId, 
            evalWithCalifications, 
            (res) => {
                Log.info(res, "POST SUCCEDED");
                setDirty(false);
                props.reloadCourse();

            }, 
            props.showError("save course")
        );

    }

    function isEvalSelected() { 
        return props.currEvalInstance && props.currEvalInstance.evaluationId !== '';
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

    const tableRender = (itemList) => {
        const filteredFields = ["student.personalData.lastName", "student.personalData.firstName", "student.fileNumber", "note"];
        let filteredList = itemList;
        if (filterValue !== '')
            filteredList = itemList.filter( cal => 
                filteredFields.some( k => {
                    Log.info(getInnerPropValue(cal, k), "getInnerPropValue(cal, k)");
                    return getInnerPropValue(cal, k) ? getInnerPropValue(cal, k).toString().toLowerCase().includes(filterValue.toLowerCase()) : false
                
                })             
            )
        return <Table hover className="mt-4" scrollable={"true"} >
            <thead>
                <tr>
                    <th width="25%">File Number</th>
                    <th width="50%">Student Name</th>
                    <th width="25%">Grade</th>
                </tr>
            </thead>
            <tbody>
                {filteredList.map( (item, index) => 
                    <tr key={index} >
                        <td style={{whiteSpace: 'nowrap'}}>{item.student.fileNumber || ''}</td>
                        <td style={{whiteSpace: 'nowrap'}}>{`${item.student.personalData.lastName}, ${item.student.personalData.firstName}` || ''}</td>
                        <td style={{whiteSpace: 'nowrap'}}>
                            <Input 
                                id={item.evaluationId}
                                name = {item.student.fileNumber}
                                value={item.note || ''} 
                                onChange={handleNoteChange}
                                disabled={!props.currEvalInstance}
                                type="float"  min="0.0" max="10.0"
                                title="A number between 0 and 10, with up to 2 decimals"
                                pattern={"^(10|10.0|10.00|([0-9])([.][0-9]([0-9])?)?)$"}
                                />
                        </td>
                    </tr>
                )}
            </tbody>
        </Table>;
    }
    
    
    return (
        <>
        <Form onSubmit={onSaveCalifications}>
            <Row>
                <Col md={10}>
                <InputGroup>
                    <Input 
                        placeholder={"Search student..."} 
                        value={filterValue} 
                        onChange={(event) => setFilterValue(event.target.value)} 
                        disabled = {!isEvalSelected()}
                        />
                    <InputGroupAddon addonType="append">
                        <Button color="secondary" onClick={() => setFilterValue('')} >Clear</Button>
                    </InputGroupAddon>
                </InputGroup>
                </Col>
                <Col>
                    <ButtonGroup style={{ padding: "0em", float: "right"}}>
                    <CRUDSaveButton
                        behavior = {{type: "submit"}}
                        entityTypeCapName = {'Calification'}
                        isDisabled = {!isEvalSelected() || !dirty}
                        />
                    </ButtonGroup>
                </Col>
            </Row>
            {tableRender(califificationFullList || [])}
        </Form>
        </>
    )
}
