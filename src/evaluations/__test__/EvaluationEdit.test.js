import React from 'react';
import {render, fireEvent, cleanup } from '@testing-library/react';
import EvaluationEdit from '../EvaluationEdit';
import * as Constants from '../../auxiliar/Constants';


afterEach(cleanup);

it("renders correctly when no evaluations are provided", () => {
    const {queryByTestId} = render(<EvaluationEdit 
        courseId={1} //props.courseId}
        evaluations = {[]} //currCourse.evaluations}
        studentQty = {2} //currCourse.students.length}
        currEvalInstance = {Constants.newEvalInstance()} //currEvalInstance}
        onSelectFunc = {null} //setCurrEvalInstanceById}
        reloadCourse={null} //reloadCourse}
        showError={null} //props.showError}
        
        />
    )
    expect(queryByTestId("evalTable")).toBeTruthy()
    expect(queryByTestId("evalTableRow_0")).toBeFalsy()
})
    
it("renders correctly when there's one evaluation and 2 students", () => {
    const {queryByTestId} = render(<EvaluationEdit 
        courseId={1} //props.courseId}
        evaluations = {[
            {
                evaluationId: '1',
                instanceName: 'TP 1',
                califications: []
            }
        ]} //currCourse.evaluations}
        studentQty = {2} //currCourse.students.length}
        currEvalInstance = {Constants.newEvalInstance()} //currEvalInstance}
        onSelectFunc = {null} //setCurrEvalInstanceById}
        reloadCourse={null} //reloadCourse}
        showError={null} //props.showError}
        
        />
    )
    expect(queryByTestId("evalTable")).toBeTruthy()
    expect(queryByTestId("evalTableRow_0")).toBeTruthy()
    expect(queryByTestId("evalTableRow_1")).toBeFalsy()

})


it("renders correctly when there are two evaluations and 2 students with no califications", () => {
    const {queryByTestId, asFragment} = render(<EvaluationEdit 
        courseId={1} //props.courseId}
        evaluations = {[
            {
                evaluationId: '1',
                instanceName: 'TP 1',
                califications: []
            },
            {
                evaluationId: '2',
                instanceName: 'TP 2',
                califications: []
            }

        ]} //currCourse.evaluations}
        studentQty = {2} //currCourse.students.length}
        currEvalInstance = {Constants.newEvalInstance()} //currEvalInstance}
        onSelectFunc = {null} //setCurrEvalInstanceById}
        reloadCourse={null} //reloadCourse}
        showError={null} //props.showError}
        
        />
    )
    expect(asFragment()).toMatchSnapshot()
    expect(queryByTestId("evalTable")).toBeTruthy()
    expect(queryByTestId("evalTableRow_0")).toBeTruthy()
    expect(queryByTestId("evalTableRow_1")).toBeTruthy()
    expect(queryByTestId("evalTableRow_2")).toBeFalsy()
    expect(queryByTestId("evalTableRowAvg_0").firstChild.nodeValue).toBe("-")
    
})
        