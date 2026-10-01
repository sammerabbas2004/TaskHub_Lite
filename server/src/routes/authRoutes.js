import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { asyncHandler } from '../utils/asyncHandler.js';
import { loginController } from '../controllers/authController.js';

const router = Router();
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: 'draft-8', legacyHeaders: false });

router.post('/login', loginLimiter, asyncHandler(loginController));
export default router;
