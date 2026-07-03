// TaskCard.jsx
// A single task card rendered inside a column.
// Shows title, priority badge, and due date with an overdue warning.
// Clicking the card opens the edit modal via the onEdit prop.
// Will be wrapped in Draggable in Phase 11.

import { useProjectContext } from '../../context/ProjectContext';
import { formatDate, isOverdue } from '../../utils/helpers';
import './TaskCard.css';

const PRIORITY_LABELS = {
  low:    'Low',
  medium: 'Medium',
  high:   'High',
};

export default function TaskCard({ task, projectId, onEdit }) {
  const { deleteTask } = useProjectContext();
  const overdue = isOverdue(task.dueDate) && task.status !== 'done';

  function handleDelete(e) {
    // Prevent the click from bubbling to the card and opening the edit modal.
    e.stopPropagation();
    if (confirm(`Delete "${task.title}"?`)) {
      deleteTask(projectId, task.id);
    }
  }

  return (
    <div
      className="task-card"
      onClick={onEdit}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onEdit()}
      aria-label={`Edit task: ${task.title}`}
    >
      <div className="task-card__header">
        <span className={`task-card__priority task-card__priority--${task.priority}`}>
          {PRIORITY_LABELS[task.priority]}
        </span>
        <button
          className="task-card__delete"
          onClick={handleDelete}
          aria-label={`Delete task: ${task.title}`}
        >
          ✕
        </button>
      </div>

      <p className="task-card__title">{task.title}</p>

      {task.description && (
        <p className="task-card__description">{task.description}</p>
      )}

      {task.dueDate && (
        <div className={`task-card__due ${overdue ? 'task-card__due--overdue' : ''}`}>
          <span>{overdue ? '⚠ Overdue · ' : '📅 '}</span>
          <span>{formatDate(task.dueDate)}</span>
        </div>
      )}
    </div>
  );
}