import React from 'react';
import {render, fireEvent, cleanup } from '@testing-library/react';
import CalificationEdit from '../CalificationEdit';
import * as Constants from '../../auxiliar/Constants';


afterEach(cleanup);

it("renders correctly when no students are provided", () => {
    const {queryByTestId} = render(<CalificationEdit 
        courseId={1}//props.courseId}
        currEvalInstance = {{ evaluationId: 2}}// currEvalInstance}
        students = {[]}//currCourse.students}
        reloadCourse={null}
        showError={null}
        />
    )
    expect(queryByTestId("califTable")).toBeTruthy()
    expect(queryByTestId("califTableRow_0")).toBeFalsy()
})
    
it("renders correctly when there's a one-student list and no califications", () => {
    const {queryByTestId} = render(<CalificationEdit 
        courseId={1}//props.courseId}
        currEvalInstance = {{ evaluationId: 2, califications: []}}// currEvalInstance}
        students = {[Constants.emptyStudent]}//currCourse.students}
        reloadCourse={null}
        showError={null}
    />
    )
    expect(queryByTestId("califTable")).toBeTruthy()
    expect(queryByTestId("califTableRow_0")).toBeTruthy()
    expect(queryByTestId("califTableRow_1")).toBeFalsy()
    expect(queryByTestId("califTableRow_0").lastChild.nodeValue).toBeNull()
})
        

it("renders correctly when there's a two-student list and one calification", () => {
    const student1 = {...Constants.emptyStudent, fileNumber: 1}
    const student2 = {...Constants.emptyStudent, fileNumber: 2}
    const {queryByTestId, asFragment} = render(<CalificationEdit 
        courseId={1}//props.courseId}
        currEvalInstance = {{ evaluationId: 2, califications: [{calificationId: 1, student: student1, note: 10}] }}// currEvalInstance}
        students = {[student1, student2] }//currCourse.students}
        reloadCourse={null}
        showError={null}
    />
    )
    expect(asFragment()).toMatchSnapshot()
    expect(queryByTestId("califTable")).toBeTruthy()
    expect(queryByTestId("califTableRow_0")).toBeTruthy()
    expect(queryByTestId("califTableRow_1")).toBeTruthy()
    expect(queryByTestId("califTableRow_2")).toBeFalsy()
    expect(queryByTestId("califTableRowInput_0").value).toBe("10")
})