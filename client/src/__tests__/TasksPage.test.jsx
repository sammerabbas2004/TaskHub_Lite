import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import TasksPage from '../pages/TasksPage.jsx';
import { AuthProvider } from '../context/AuthContext.jsx';
import api from '../services/api.js';

vi.mock('../services/api.js', () => ({
  default: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() }
}));

describe('TasksPage', () => {
  beforeEach(() => {
    localStorage.setItem('taskhub_user', JSON.stringify({ id: '1', email: 'user@example.com', role: 'user' }));
    localStorage.setItem('taskhub_token', 'test-token');
    api.get.mockResolvedValue({ data: { data: [{ _id: 't1', title: 'Build dashboard', status: 'todo', tags: ['frontend'], owner: { _id: '1', email: 'user@example.com' } }], pagination: { page: 1, limit: 5, total: 1, totalPages: 1 } } });
  });

  it('renders task list from mocked API', async () => {
    render(<MemoryRouter><AuthProvider><TasksPage /></AuthProvider></MemoryRouter>);
    expect(screen.getByText('Loading tasks…')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('Build dashboard')).toBeInTheDocument());
    expect(screen.getByText('#frontend')).toBeInTheDocument();
  });
});
