import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    status: { type: String, enum: ['todo', 'in_progress', 'done'], default: 'todo', index: true },
    tags: { type: [String], default: [] },
    dueDate: { type: Date, default: null, index: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }
  },
  { timestamps: true }
);

taskSchema.index({ owner: 1, createdAt: -1 });
taskSchema.index({ owner: 1, status: 1, dueDate: 1 });
taskSchema.index({ title: 'text', tags: 'text' });

export const Task = mongoose.model('Task', taskSchema);
