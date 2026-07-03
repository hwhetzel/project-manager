// Column.jsx
// A single Kanban column — To Do, In Progress, or Done.
// Receives its filtered tasks as props and renders a TaskCard for each.
// Will be wrapped in Droppable in Phase 11 when drag and drop is added.

import TaskCard from './TaskCard';
import './Column.css';

// Maps column IDs to accent colors for the header stripe.
const COLUMN_COLORS = {
  todo:       'var(--color-text-muted)',
  inprogress: 'var(--color-warning)',
  done:       'var(--color-success)',
};

export default function Column({ columnId, label, tasks, projectId, onEditTask }) {
  const accentColor = COLUMN_COLORS[columnId];

  return (
    <div className="column">
      {/* Column header */}
      <div className="column__header">
        <div className="column__title-row">
          <span
            className="column__accent"
            style={{ backgroundColor: accentColor }}
          />
          <h2 className="column__title">{label}</h2>
          <span className="column__count">{tasks.length}</span>
        </div>
      </div>

      {/* Task list */}
      <div className="column__tasks">
        {tasks.length === 0 ? (
          <div className="column__empty">
            <p>No tasks here</p>
          </div>
        ) : (
          tasks.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              index={index}
              projectId={projectId}
              onEdit={() => onEditTask(task)}
            />
          ))
        )}
      </div>
    </div>
  );
}