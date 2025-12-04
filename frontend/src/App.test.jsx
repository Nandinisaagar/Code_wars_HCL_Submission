import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });

  it('renders Hospital App in navbar', () => {
    render(<App />);
    expect(screen.getByText('Hospital App')).toBeInTheDocument();
  });

  it('renders landing page by default', () => {
    render(<App />);
    expect(screen.getByText(/Welcome to Our Hospital/i)).toBeInTheDocument();
  });
});
