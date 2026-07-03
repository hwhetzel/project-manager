// Column.jsx
// A single Kanban column — To Do, In Progress, or Done.
// Wrapped in Droppable so tasks can be dragged into it.
// Passes the droppableId (column ID) to @hello-pangea/dnd so BoardPage
// knows which column a task was dropped into when handleDragEnd fires.

import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import './Column.css';

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

      {/* Droppable — the droppableId must match the column's status string
          so handleDragEnd in BoardPage can map it to the right column.
          The render prop provides snapshot.isDraggingOver for visual feedback. */}
      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            className={`column__tasks ${snapshot.isDraggingOver ? 'column__tasks--drag-over' : ''}`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tasks.length === 0 && !snapshot.isDraggingOver ? (
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

            {/* Placeholder preserves column height while a card is being dragged out.
                Must be rendered inside the Droppable div — required by the library. */}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}