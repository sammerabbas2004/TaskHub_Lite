import { z } from 'zod';

const status = z.enum(['todo', 'in_progress', 'done']);
const emptyToUndefined = (schema) => z.preprocess((value) => value === '' ? undefined : value, schema.optional());
const tags = z.array(z.string().trim().min(1).max(30)).max(10).default([]);

export const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(200),
  status: status.optional().default('todo'),
  tags: tags.optional().default([]),
  dueDate: z.coerce.date().nullable().optional().default(null)
});

export const updateTaskSchema = createTaskSchema.partial();

export const taskQuerySchema = z.object({
  status: emptyToUndefined(status),
  tag: emptyToUndefined(z.string().trim().min(1)),
  search: emptyToUndefined(z.string().trim().max(100)),
  sortBy: z.enum(['createdAt', 'updatedAt', 'title', 'dueDate', 'status']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10)
});
