// TaskCard.jsx
// A single task card rendered inside a column.
// Wrapped in Draggable so it can be picked up and moved between columns.
// The draggableId must be the task's unique ID so BoardPage can identify
// which task moved when handleDragEnd fires.

import { Draggable } from '@hello-pangea/dnd';
import { useProjectContext } from '../../context/ProjectContext';
import { formatDate, isOverdue, isDueToday } from '../../utils/helpers';
import './TaskCard.css';

const PRIORITY_LABELS = {
  low:    'Low',
  medium: 'Medium',
  high:   'High',
};

export default function TaskCard({ task, index, projectId, onEdit }) {
  const { deleteTask } = useProjectContext();
  const overdue = isOverdue(task.dueDate) && task.status !== 'done';

  function handleDelete(e) {
    e.stopPropagation();
    if (confirm(`Delete "${task.title}"?`)) {
      deleteTask(projectId, task.id);
    }
  }

  return (
    // index is required by Draggable so the library knows the card's
    // position in the list for reordering calculations.
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          className={`task-card ${snapshot.isDragging ? 'task-card--dragging' : ''}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
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

          {task.dueDate && (() => {
            const done = task.status === 'done';
            const overdue = !done && isOverdue(task.dueDate);
            const today = !done && !overdue && isDueToday(task.dueDate);
            const modifier = done ? 'done' : overdue ? 'overdue' : today ? 'today' : '';
            const icon = overdue ? '⚠' : today ? '⏰' : '📅';
            const label = overdue
              ? `Overdue · ${formatDate(task.dueDate)}`
              : today ? 'Due today'
              : formatDate(task.dueDate);

            return (
              <div className={`task-card__due${modifier ? ` task-card__due--${modifier}` : ''}`}>
                <span>{icon}</span>
                <span>{label}</span>
              </div>
            );
          })()}
        </div>
      )}
    </Draggable>
  );
}