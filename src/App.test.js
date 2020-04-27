import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders course list screen', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/courses/i);
  expect(linkElement).toBeInTheDocument();
});
