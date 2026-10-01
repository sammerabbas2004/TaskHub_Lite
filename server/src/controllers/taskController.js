import { createTaskSchema, taskQuerySchema, updateTaskSchema } from '../validators/task.js';
import * as taskService from '../services/taskService.js';

export async function listTasksController(req, res) {
  res.json(await taskService.listTasks(req.user, taskQuerySchema.parse(req.query)));
}

export async function getTaskController(req, res) {
  res.json({ data: await taskService.getTask(req.user, req.params.id) });
}

export async function createTaskController(req, res) {
  res.status(201).json({ data: await taskService.createTask(req.user, createTaskSchema.parse(req.body)) });
}

export async function updateTaskController(req, res) {
  res.json({ data: await taskService.updateTask(req.user, req.params.id, updateTaskSchema.parse(req.body)) });
}

export async function deleteTaskController(req, res) {
  res.json(await taskService.deleteTask(req.user, req.params.id));
}
