import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  createTaskController,
  deleteTaskController,
  getTaskController,
  listTasksController,
  updateTaskController
} from '../controllers/taskController.js';

const router = Router();
const taskLimiter = rateLimit({ windowMs: 60 * 1000, limit: 120, standardHeaders: 'draft-8', legacyHeaders: false });

router.use(authenticate, taskLimiter);
router.get('/', asyncHandler(listTasksController));
router.get('/:id', asyncHandler(getTaskController));
router.post('/', asyncHandler(createTaskController));
router.patch('/:id', asyncHandler(updateTaskController));
router.delete('/:id', asyncHandler(deleteTaskController));

export default router;
