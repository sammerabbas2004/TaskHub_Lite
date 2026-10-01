import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.clientUrl }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

const clientDist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../client/dist');
app.use(express.static(clientDist));
app.get('*splat', (req, res, next) => {
  if (req.method === 'GET' && req.accepts('html')) return res.sendFile(path.join(clientDist, 'index.html'), (error) => error && next());
  next();
});

app.use(notFound);
app.use(errorHandler);
