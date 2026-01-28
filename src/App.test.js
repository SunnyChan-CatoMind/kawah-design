import { render, screen } from '@testing-library/react';
import App from './App';

test('renders K. WAH header', () => {
  render(<App />);
  const headerElement = screen.getByText(/K. WAH/i);
  expect(headerElement).toBeInTheDocument();
});

