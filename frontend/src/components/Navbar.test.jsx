import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import Navbar from './Navbar';

const MockNavbar = () => (
  <BrowserRouter>
    <Navbar />
  </BrowserRouter>
);

describe('Navbar Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the app title', () => {
    render(<MockNavbar />);
    expect(screen.getByText('Hospital App')).toBeInTheDocument();
  });

  it('shows Login and Signup when not authenticated', () => {
    render(<MockNavbar />);
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Signup')).toBeInTheDocument();
  });

  it('shows Dashboard and Logout when authenticated as patient', () => {
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('role', 'patient');

    render(<MockNavbar />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('shows Dashboard link for doctor when authenticated', () => {
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('role', 'doctor');

    render(<MockNavbar />);
    const dashboardLink = screen.getByText('Dashboard');
    expect(dashboardLink).toBeInTheDocument();
    expect(dashboardLink.closest('a')).toHaveAttribute('href', '/doctor-dashboard');
  });

  it('clears localStorage on logout', () => {
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('role', 'patient');

    render(<MockNavbar />);

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('role')).toBeNull();
  });
});
