import mongoose from 'mongoose';
import { Task } from '../models/Task.js';
import { HttpError } from '../utils/httpError.js';

function ownerFilter(user) {
  return user.role === 'admin' ? {} : { owner: user._id };
}

export async function listTasks(user, query) {
  const { status, tag, search, sortBy, order, page, limit } = query;
  const filter = ownerFilter(user);
  if (status) filter.status = status;
  if (tag) filter.tags = tag;
  if (search) filter.$text = { $search: search };

  const sort = { [sortBy]: order === 'asc' ? 1 : -1, _id: 1 };
  const skip = (page - 1) * limit;
  const [tasks, total] = await Promise.all([
    Task.find(filter).populate('owner', 'email role').sort(sort).skip(skip).limit(limit).lean(),
    Task.countDocuments(filter)
  ]);

  return {
    data: tasks,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  };
}

function validateOwnerId(id) {
  if (!mongoose.isValidObjectId(id)) throw new HttpError(400, 'Invalid task identifier');
}

export async function getTask(user, id) {
  validateOwnerId(id);
  const filter = { _id: id, ...ownerFilter(user) };
  const task = await Task.findOne(filter).populate('owner', 'email role').lean();
  if (!task) throw new HttpError(404, 'Task not found');
  return task;
}

export async function createTask(user, data) {
  const task = await Task.create({ ...data, owner: user._id });
  return Task.findById(task._id).populate('owner', 'email role').lean();
}

export async function updateTask(user, id, data) {
  validateOwnerId(id);
  const task = await Task.findOneAndUpdate({ _id: id, ...ownerFilter(user) }, data, {
    new: true,
    runValidators: true
  }).populate('owner', 'email role').lean();
  if (!task) throw new HttpError(404, 'Task not found');
  return task;
}

export async function deleteTask(user, id) {
  validateOwnerId(id);
  const task = await Task.findOneAndDelete({ _id: id, ...ownerFilter(user) });
  if (!task) throw new HttpError(404, 'Task not found');
  return { message: 'Task deleted successfully' };
}
