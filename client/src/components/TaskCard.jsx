export default function TaskCard({ task, canManage, onEdit, onDelete }) {
  return (
    <article className="task-card">
      <div className="task-card-main">
        <div>
          <h3>{task.title}</h3>
          <p className="muted">Owner: {task.owner?.email || 'Unknown'}</p>
        </div>
        <span className={`status status-${task.status}`}>{task.status.replace('_', ' ')}</span>
      </div>
      <div className="tags">{task.tags?.map((tag) => <span key={tag}>#{tag}</span>)}</div>
      <div className="task-meta">
        <span>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</span>
        {canManage && <div><button onClick={() => onEdit(task)}>Edit</button><button className="danger" onClick={() => onDelete(task)}>Delete</button></div>}
      </div>
    </article>
  );
}
