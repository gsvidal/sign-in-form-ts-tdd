import { render, screen } from '@testing-library/react';
import App from './App';

test('App should render the title', () => {
  render(<App />);
  const headingElement = screen.getByRole('heading', { name: /sign in form/i });
  expect(headingElement).toBeInTheDocument();
});
