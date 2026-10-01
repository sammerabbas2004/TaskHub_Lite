import { ZodError } from 'zod';
import mongoose from 'mongoose';

export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: err.issues.map((issue) => ({ field: issue.path.join('.'), message: issue.message }))
    });
  }

  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({ message: 'Invalid resource identifier' });
  }

  if (err?.code === 11000) {
    return res.status(409).json({ message: 'A resource with that unique value already exists' });
  }

  const status = err.status || 500;
  return res.status(status).json({
    message: status >= 500 ? 'Internal server error' : err.message,
    ...(err.details ? { details: err.details } : {})
  });
}

export function notFound(req, res) {
  res.status(404).json({ message: 'Route not found' });
}
