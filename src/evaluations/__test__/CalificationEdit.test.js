import React from 'react';
import {render, fireEvent } from '@testing-library/react';
import { CalificationEdit } from '../CalificationEdit';

it("renders correctly", () => {
    const {queryByTestId} = render(
        <CalificationEdit 
            courseId={1}//props.courseId}
            evaluations = {[]}//currCourse.evaluations}
            studentQty = {3}//currCourse.students.length}
            currEvalInstance = {{}}//currEvalInstance}
            onSelectFunc = {null}//setCurrEvalInstanceById}
            reloadCourse={null}//reloadCourse}
            showError={false}//props.showError}
        />
    )
    expect(queryByTestId("evalEdit")).toBeTruthy()
})