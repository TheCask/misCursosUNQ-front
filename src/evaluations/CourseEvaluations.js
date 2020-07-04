import React, { useState, useEffect } from 'react';
import AppNavbar from '../AppNavbar';
import { Container } from 'reactstrap';
import Col from 'reactstrap/lib/Col';
import Row from 'reactstrap/lib/Row';
import Log from '../auxiliar/Log';
import * as CourseAPI from '../services/CourseAPI';
import EvaluationEdit from './EvaluationEdit';
import CalificationEdit from './CalificationEdit';
import * as Constants from '../auxiliar/Constants'

function CourseEvaluations(props) {

    function newEvalInstance() {
        return {
            evaluationId: '',
            instanceName: 'TP ',
            califications: []
        }
    }

    const [forceApiReqState, forceApiReq] = useState(false);
    const [currCourse, setCurrCourse] = useState(Constants.emptyNewCourse);
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

    const setCurrEvalInstanceById = itemId => {
            const newCurrEvalInstance = currCourse.evaluations.find( ev => ev.evaluationId === itemId)
            setCurrEvalInstance(newCurrEvalInstance);
    }

    Log.info("Course Evaluations")

    return (
        <AppNavbar>
            <Container>
                <hr/>
                <Row>
                <Col>
                    <h2>Evaluation Instance</h2>
                    {/* <hr/> */}
                    <EvaluationEdit  data-testid={"evalEdit"}
                        courseId={props.courseId}
                        evaluations = {currCourse.evaluations}
                        studentQty = {currCourse.students.length}
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