import { useCallback, useEffect, useState } from 'react';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import TaskCard from '../components/TaskCard.jsx';
import TaskForm from '../components/TaskForm.jsx';

const initialFilters = { search: '', status: '', tag: '', sortBy: 'createdAt', order: 'desc', page: 1, limit: 5 };

export default function TasksPage() {
  const { user, logout } = useAuth();
  const [filters, setFilters] = useState(initialFilters);
  const [result, setResult] = useState({ data: [], pagination: { page: 1, limit: 5, total: 0, totalPages: 0 } });
  const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const [editing, setEditing] = useState(undefined); const [saving, setSaving] = useState(false);

  const loadTasks = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([key, value]) => value !== ''));
      const { data } = await api.get('/tasks', { params });
      setResult(data);
    }
    catch (err) { if (err.response?.status === 401) logout(); else setError(err.response?.data?.message || 'Unable to load tasks'); }
    finally { setLoading(false); }
  }, [filters, logout]);

  useEffect(() => { loadTasks(); }, [loadTasks]);

  const changeFilter = (name, value) => setFilters((f) => ({ ...f, [name]: value, ...(name !== 'page' ? { page: 1 } : {}) }));
  const saveTask = async (payload) => {
    setSaving(true); setError('');
    try {
      if (editing && editing !== true) await api.patch(`/tasks/${editing._id}`, payload);
      else await api.post('/tasks', payload);
      setEditing(undefined); await loadTasks();
    } catch (err) { setError(err.response?.data?.message || 'Unable to save task'); }
    finally { setSaving(false); }
  };
  const deleteTask = async (task) => {
    if (!window.confirm(`Delete "${task.title}"?`)) return;
    try { await api.delete(`/tasks/${task._id}`); await loadTasks(); }
    catch (err) { setError(err.response?.data?.message || 'Unable to delete task'); }
  };

  const totalPages = result.pagination.totalPages;
  return <main className="app-shell">
    <header className="topbar"><div><p className="eyebrow">TASKHUB LITE</p><h1>Tasks</h1></div><div className="user-menu"><span>{user.email} · {user.role}</span><button onClick={logout}>Log out</button></div></header>
    <section className="toolbar">
      <input aria-label="Search tasks" placeholder="Search title or tags…" value={filters.search} onChange={(e) => changeFilter('search', e.target.value)} />
      <input aria-label="Filter by tag" placeholder="Tag" value={filters.tag} onChange={(e) => changeFilter('tag', e.target.value)} />
      <select aria-label="Filter by status" value={filters.status} onChange={(e) => changeFilter('status', e.target.value)}><option value="">All statuses</option><option value="todo">To do</option><option value="in_progress">In progress</option><option value="done">Done</option></select>
      <select aria-label="Sort by" value={filters.sortBy} onChange={(e) => changeFilter('sortBy', e.target.value)}><option value="createdAt">Created</option><option value="updatedAt">Updated</option><option value="title">Title</option><option value="dueDate">Due date</option><option value="status">Status</option></select>
      <button onClick={() => changeFilter('order', filters.order === 'asc' ? 'desc' : 'asc')}>{filters.order === 'asc' ? '↑ Asc' : '↓ Desc'}</button>
      <button className="primary" onClick={() => setEditing(true)}>+ New task</button>
    </section>
    {error && <div className="error">{error}</div>}
    {editing && <div className="modal-backdrop"><div className="modal"><TaskForm task={editing === true ? null : editing} onSubmit={saveTask} onCancel={() => setEditing(undefined)} busy={saving} /></div></div>}
    <section className="task-list" aria-label="Task list">
      {loading ? <div className="empty">Loading tasks…</div> : result.data.length ? result.data.map((task) => <TaskCard key={task._id} task={task} canManage={user.role === 'admin' || String(task.owner?._id) === String(user.id)} onEdit={setEditing} onDelete={deleteTask} />) : <div className="empty">No tasks match your filters.</div>}
    </section>
    <footer className="pagination"><span>{result.pagination.total} task{result.pagination.total === 1 ? '' : 's'}</span><div><button disabled={filters.page <= 1} onClick={() => changeFilter('page', filters.page - 1)}>Previous</button><span>Page {filters.page} of {totalPages || 1}</span><button disabled={filters.page >= totalPages} onClick={() => changeFilter('page', filters.page + 1)}>Next</button></div></footer>
  </main>;
}
