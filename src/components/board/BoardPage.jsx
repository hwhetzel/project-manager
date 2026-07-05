// BoardPage.jsx
// The main Kanban board for a specific project.
// Pulls the project from context using the :projectId URL param.
// Owns the DragDropContext — when a drag ends, it calls moveTask to
// update state and persist the new column + order to localStorage.

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext } from '@hello-pangea/dnd';
import { useProjectContext } from '../../context/ProjectContext';
import Sidebar from '../shared/Sidebar';
import Column from './Column';
import Button from '../shared/Button';
import NewTaskModal from '../modals/NewTaskModal';
import { countOverdue, calcProgress } from '../../utils/helpers';
import './BoardPage.css';

const COLUMNS = [
  { id: 'todo',       label: 'To Do' },
  { id: 'inprogress', label: 'In Progress' },
  { id: 'done',       label: 'Done' },
];

export default function BoardPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { getProjectById, moveTask } = useProjectContext();

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterDue, setFilterDue] = useState('all');

  const project = getProjectById(projectId);

  if (!project) {
    return (
      <div className="board__not-found">
        <p>Project not found.</p>
        <Button onClick={() => navigate('/')}>Go Home</Button>
      </div>
    );
  }

  const progress = calcProgress(project.tasks);
  const overdueCount = countOverdue(project.tasks);

  // Count how many filters are currently active so we can show a badge.
  const activeFilterCount = (filterPriority !== 'all' ? 1 : 0) + (filterDue !== 'all' ? 1 : 0);

  // Called by @hello-pangea/dnd when the user finishes a drag.
  // `result` contains the draggable ID, source droppable, and destination droppable.
  // We bail early if there's no destination (dropped outside a column) or
  // if the task was dropped back in the same position it started.
  function handleDragEnd(result) {
    const { draggableId, source, destination } = result;

    // Dropped outside any column — do nothing.
    if (!destination) return;

    // Dropped in the same column at the same index — do nothing.
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

    // destination.droppableId is the column ID ('todo' | 'inprogress' | 'done').
    // destination.index is the position within that column's visible task list.
    moveTask(projectId, draggableId, destination.droppableId, destination.index);
  }

  function getFilteredTasks(status) {
    return project.tasks.filter(task => {
      if (task.status !== status) return false;
      if (filterPriority !== 'all' && task.priority !== filterPriority) return false;

      if (filterDue !== 'all') {
        const today = new Date().toISOString().slice(0, 10);
        const due = task.dueDate?.slice(0, 10);
        if (filterDue === 'overdue')  {
          if (!due || due >= today || task.status === 'done') return false;
        }
        if (filterDue === 'today')    { if (due !== today) return false; }
        if (filterDue === 'upcoming') { if (!due || due <= today) return false; }
      }

      return true;
    });
  }

  function handleEditTask(task) {
    setEditingTask(task);
    setShowTaskModal(true);
  }

  function handleCloseModal() {
    setShowTaskModal(false);
    setEditingTask(null);
  }

  return (
    <div className="board-layout">
      <Sidebar />

      {/* DragDropContext must wrap all Droppable columns.
          It receives one callback — onDragEnd — and nothing else. */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="board">
          {/* Board header */}
          <div className="board__header">
            <div className="board__header-left">
              <h1 className="board__title">{project.name}</h1>
              {project.description && (
                <p className="board__description">{project.description}</p>
              )}
            </div>

            <div className="board__header-right">
              <div className="board__stats">
                <span className="board__stat">
                  {project.tasks.length} task{project.tasks.length !== 1 ? 's' : ''}
                </span>
                <span className="board__stat board__stat--progress">
                  {progress}% complete
                </span>
                {overdueCount > 0 && (
                  <span className="board__stat board__stat--overdue">
                    {overdueCount} overdue
                  </span>
                )}
              </div>
              <Button onClick={() => setShowTaskModal(true)}>+ Add Task</Button>
            </div>
          </div>

          {/* Filter bar */}
          <div className="board__filters">
            <div className="board__filter-group">
              <label className="board__filter-label">Priority</label>
              <div className="board__filter-buttons">
                {['all', 'low', 'medium', 'high'].map(p => (
                  <button
                    key={p}
                    className={`board__filter-btn ${filterPriority === p ? 'board__filter-btn--active' : ''}`}
                    onClick={() => setFilterPriority(p)}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="board__filter-group">
              <label className="board__filter-label">Due Date</label>
              <div className="board__filter-buttons">
                {['all', 'overdue', 'today', 'upcoming'].map(d => (
                  <button
                    key={d}
                    className={`board__filter-btn ${filterDue === d ? 'board__filter-btn--active' : ''}`}
                    onClick={() => setFilterDue(d)}
                  >
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear all filters — only visible when at least one filter is active */}
            {activeFilterCount > 0 && (
              <button
                className="board__filter-clear"
                onClick={() => { setFilterPriority('all'); setFilterDue('all'); }}
              >
                Clear {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} ✕
              </button>
            )}
          </div>

          {/* Columns — each one is a Droppable, each task card is a Draggable */}
          <div className="board__columns">
            {COLUMNS.map(col => (
              <Column
                key={col.id}
                columnId={col.id}
                label={col.label}
                tasks={getFilteredTasks(col.id)}
                projectId={projectId}
                onEditTask={handleEditTask}
              />
            ))}
          </div>
        </div>
      </DragDropContext>

      {showTaskModal && (
        <NewTaskModal
          projectId={projectId}
          task={editingTask}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}