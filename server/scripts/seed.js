import bcrypt from 'bcryptjs';
import { connectDb, disconnectDb } from '../src/config/db.js';
import { User } from '../src/models/User.js';
import { Task } from '../src/models/Task.js';

const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';
const userPassword = process.env.USER_PASSWORD || 'User123!';

await connectDb();
await User.deleteMany({ email: { $in: ['admin@example.com', 'user@example.com'] } });

const [admin, user] = await User.create([
  { email: 'admin@example.com', passwordHash: await bcrypt.hash(adminPassword, 12), role: 'admin' },
  { email: 'user@example.com', passwordHash: await bcrypt.hash(userPassword, 12), role: 'user' }
]);

await Task.deleteMany({ owner: { $in: [admin._id, user._id] } });
await Task.insertMany([
  { title: 'Review all project tasks', status: 'in_progress', tags: ['admin', 'review'], dueDate: new Date(Date.now() + 86400000 * 3), owner: admin._id },
  { title: 'Prepare release checklist', status: 'todo', tags: ['release'], dueDate: new Date(Date.now() + 86400000 * 5), owner: admin._id },
  { title: 'Build login screen', status: 'done', tags: ['frontend'], dueDate: new Date(Date.now() - 86400000), owner: user._id },
  { title: 'Add task filtering', status: 'in_progress', tags: ['frontend', 'search'], dueDate: new Date(Date.now() + 86400000 * 2), owner: user._id },
  { title: 'Write API tests', status: 'todo', tags: ['backend', 'testing'], dueDate: new Date(Date.now() + 86400000 * 7), owner: user._id }
]);

console.log('Seed complete.');
console.log('Admin: admin@example.com /', adminPassword);
console.log('User:  user@example.com /', userPassword);
await disconnectDb();
