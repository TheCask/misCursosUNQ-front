import React from 'react';
import {render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'
import CRUDCancelButton from '../CRUDCancelButton';

it("renders correctly", () => {
    const {queryByTestId} = render(<CRUDCancelButton
        behavior = {{ onClick: parseInt }}
        entityTypeCapName = {'Type'}
        isDisabled = {false}   // OPTIONAL
    />)
    expect(queryByTestId("buttonTestId")).toBeTruthy()
})