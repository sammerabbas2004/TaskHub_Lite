import { useEffect, useState } from 'react';

const blank = { title: '', status: 'todo', tags: '', dueDate: '' };

export default function TaskForm({ task, onSubmit, onCancel, busy }) {
  const [form, setForm] = useState(blank);

  useEffect(() => {
    setForm(task ? {
      title: task.title,
      status: task.status,
      tags: task.tags?.join(', ') || '',
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : ''
    } : blank);
  }, [task]);

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = (event) => {
    event.preventDefault();
    onSubmit({
      title: form.title.trim(),
      status: form.status,
      tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      dueDate: form.dueDate || null
    });
  };

  return (
    <form className="task-form" onSubmit={submit}>
      <h2>{task ? 'Edit task' : 'Create task'}</h2>
      <label>Title<input name="title" value={form.title} onChange={update} required maxLength={200} /></label>
      <label>Status<select name="status" value={form.status} onChange={update}><option value="todo">To do</option><option value="in_progress">In progress</option><option value="done">Done</option></select></label>
      <label>Tags<input name="tags" value={form.tags} onChange={update} placeholder="frontend, urgent" /></label>
      <label>Due date<input type="date" name="dueDate" value={form.dueDate} onChange={update} /></label>
      <div className="form-actions"><button type="button" onClick={onCancel}>Cancel</button><button disabled={busy}>{busy ? 'Saving…' : 'Save task'}</button></div>
    </form>
  );
}
