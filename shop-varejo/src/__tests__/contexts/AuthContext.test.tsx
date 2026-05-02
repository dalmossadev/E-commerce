import React, { act } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

// Mock fetch
global.fetch = jest.fn();

function TestComponent() {
  const { user, isAuthenticated, isLoading, login, logout, role } = useAuth();
  return (
    <div>
      <div data-testid="loading">{isLoading ? 'loading' : 'not-loading'}</div>
      <div data-testid="authenticated">{isAuthenticated ? 'yes' : 'no'}</div>
      <div data-testid="role">{role || 'no-role'}</div>
      {user ? <div data-testid="user">{user.email}</div> : <div data-testid="user">no-user</div>}
      <button onClick={() => login('test@example.com', 'password')}>Login</button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('should start with loading state', () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({})
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('loading').textContent).toBe('loading');
  });

  it('should set user when authenticated', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        user: { id: 1, email: 'test@example.com', name: 'Test User', role: 'CUSTOMER' }
      })
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('not-loading');
    });

    expect(screen.getByTestId('authenticated').textContent).toBe('yes');
    expect(screen.getByTestId('user').textContent).toBe('test@example.com');
    expect(screen.getByTestId('role').textContent).toBe('CUSTOMER');
  });

  it('should login successfully', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: false }) // checkAuth
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          user: { id: 1, email: 'test@example.com', name: 'Test', role: 'CUSTOMER' }
        })
      });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('not-loading');
    });

    await act(async () => {
      screen.getByText('Login').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('authenticated').textContent).toBe('yes');
    });
  });

  it('should logout successfully', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: false }) // checkAuth
      .mockResolvedValueOnce({ ok: true }) // logout
      ;

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('not-loading');
    });

    await act(async () => {
      screen.getByText('Logout').click();
    });

    expect(screen.getByTestId('authenticated').textContent).toBe('no');
    expect(screen.getByTestId('user').textContent).toBe('no-user');
  });
});
