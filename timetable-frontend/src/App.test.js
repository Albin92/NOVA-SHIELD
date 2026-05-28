import { render, screen } from '@testing-library/react';
import App from './App';

test('renders timetable generator title', () => {
  render(<App />);
  const linkElement = screen.getByText(/NovaShield Timetable Engine/i);
  expect(linkElement).toBeInTheDocument();
});
