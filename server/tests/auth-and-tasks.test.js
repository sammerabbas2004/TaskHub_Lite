import bcrypt from 'bcryptjs';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../src/app.js';
import { User } from '../src/models/User.js';
import { Task } from '../src/models/Task.js';
import './setup.js';

describe('TaskHub API', () => {
  it('logs in with valid seeded-style credentials and returns JWT', async () => {
    await User.create({ email: 'user@example.com', passwordHash: await bcrypt.hash('User123!', 10), role: 'user' });

    const response = await request(app).post('/api/auth/login').send({ email: 'user@example.com', password: 'User123!' });

    expect(response.status).toBe(200);
    expect(response.body.token).toEqual(expect.any(String));
    expect(response.body.user).toMatchObject({ email: 'user@example.com', role: 'user' });
  });

  it('returns paginated tasks from GET /api/tasks', async () => {
    const user = await User.create({ email: 'user@example.com', passwordHash: await bcrypt.hash('User123!', 10), role: 'user' });
    await Task.insertMany(Array.from({ length: 5 }, (_, i) => ({ title: `Task ${i + 1}`, owner: user._id })));
    const login = await request(app).post('/api/auth/login').send({ email: 'user@example.com', password: 'User123!' });

    const response = await request(app)
      .get('/api/tasks?page=2&limit=2&sortBy=title&order=asc')
      .set('Authorization', `Bearer ${login.body.token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(2);
    expect(response.body.pagination).toEqual({ page: 2, limit: 2, total: 5, totalPages: 3 });
  });
});
