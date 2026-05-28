import { render, screen } from '@testing-library/react';
import App from './App';

test('renders timetable generator title', () => {
  render(<App />);
  const linkElement = screen.getByText(/Timetable Generator/i);
  expect(linkElement).toBeInTheDocument();
});
