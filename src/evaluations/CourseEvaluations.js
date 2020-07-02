import React, { useState, useEffect } from 'react';
import AppNavbar from '../AppNavbar';
import { Container } from 'reactstrap';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import Log from '../auxiliar/Log';
import * as CourseAPI from '../services/CourseAPI';
import EvaluationEdit from './EvaluationEdit';
import CalificationEdit from './CalificationEdit';

function CourseEvaluations(props) {

    const emptyCourse = {
        courseCode: '',
        courseShift: 'Mañana',
        courseIsOpen: true,
        courseYear: 2020,
        courseSeason: '1C',
        courseLocation: '',
        subject: {
            code: '',
            name: ''
        },
        students: [],
        lessons: [],
        teachers: [],
        evaluations: []
    }

    function newEvalInstance() {
        return {
            evaluationId: '',
            instanceName: 'TP ',
            califications: []
        }
    }

    const [forceApiReqState, forceApiReq] = useState(false);
    const [currCourse, setCurrCourse] = useState(emptyCourse);
    const [currEvalInstance , setCurrEvalInstance] = useState(newEvalInstance());

    useEffect( () => {
        CourseAPI.getCourseByIdAsync(props.courseId, 
            course => {                
                setCurrCourse(course);
                Log.info("fetch occured");
                //setEvaluations(course.evaluations)
            }, 
            props.showError("get course by ID"))
        }, [forceApiReqState]);

    function reloadCourse(){
        forceApiReq(n => !n)
    }
    /*
    function selectLastEvaluation(){
        Log.info(currCourse.evaluations, "currCourse.evaluations")
        const lastEvalId = currCourse.evaluations.reduce((maxId, elem) => Math.max(elem.evaluationId, maxId), -1);
        Log.info(lastEvalId, "lastEvalId")
        if ( !isNaN(lastEvalId) && lastEvalId !== -1 )
            setCurrEvalInstanceById(lastEvalId);
    }
    */
    const setCurrEvalInstanceById = itemId => {
            const newCurrEvalInstance = currCourse.evaluations.find( ev => ev.evaluationId === itemId)
            setCurrEvalInstance(newCurrEvalInstance);
    }

  

    /*
    function filterNonEmptyCalifications(califications){
        califications.filter( cal => cal.note !== '' && isNaN(cal.note))
    }
    function handleAddSubmit(getEval) {
        CourseAPI.postCourseEvaluationAsync(
            currCourse.courseId, 
            getEval(), 
            (res) => {
                Log.info(res, "POST SUCCEDED");
                reloadCourse();
                

            }, 
            props.showError("save course"));
    }

    
    
    function EvalEdit(){

        Log.info("EvaEdit");

        return (
            <>
            <ButtonGroup style={{ padding: "0em", float: "right"}}>
                <CRUDAddButton 
                    behavior = {{ onProceed: handleAddSubmit }}  // requires either {onClick: <myFunc>} or {to: <'/my/link'>' tag={Link}} 
                    onClick = {() => {}}
                    entityTypeCapName = {'Evaluation'}
                    isDisabled = {false}
                    getEntity = {newEvalInstance()}
                    />
            </ButtonGroup>
            <EvaluationPicker 
                getEvaluations = {currCourse.evaluations}
                onSelectFunc = {setCurrEvalInstanceById}
                currEvalInstance = {currEvalInstance}
                />
            </>
        )
    }
    */
    

    Log.info("Course Evaluations")

    return (
        <AppNavbar>
            <Container>
                <hr/>
                <Row>
                <Col>
                    <h2>Evaluation Instance</h2>
                    {/* <hr/> */}
                    <EvaluationEdit  
                        courseId={props.courseId}
                        evaluations = {currCourse.evaluations}
                        currEvalInstance = {currEvalInstance}
                        onSelectFunc = {setCurrEvalInstanceById}
                        reloadCourse={reloadCourse}
                        showError={props.showError}
                    />
                </Col>
                <hr style={{ border: "none", borderLeft: "1px solid rgba(0,0,0,.1)", height: "90vh", width: "1px", color: "danger"}} />
                <Col>
                    <h2>Califications</h2>
                    {/* <hr/> */}
                    <CalificationEdit
                        courseId={props.courseId}
                        currEvalInstance = {currEvalInstance}
                        students = {currCourse.students}
                        reloadCourse={reloadCourse}
                        showError={props.showError}
                    />
                </Col>
                </Row>
            </Container>
        </AppNavbar>
    );
}

export default React.memo(CourseEvaluations)