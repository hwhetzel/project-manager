// NewTaskModal.jsx
// Modal form for creating a new task or editing an existing one.
// When `task` prop is null/undefined — creation mode.
// When `task` prop is a task object — edit mode (fields pre-filled).
// On submit, calls either addTask or updateTask from context depending on mode.

import { useState } from 'react';
import { useProjectContext } from '../../context/ProjectContext';
import Button from '../shared/Button';
import './Modal.css';

const PRIORITIES = ['low', 'medium', 'high'];

export default function NewTaskModal({ projectId, task, onClose }) {
  const { addTask, updateTask } = useProjectContext();
  const isEditing = Boolean(task);

  // Pre-fill fields when editing, blank when creating.
  const [title, setTitle]             = useState(task?.title       || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority]       = useState(task?.priority    || 'medium');
  const [dueDate, setDueDate]         = useState(task?.dueDate     || '');
  const [error, setError]             = useState('');

  function handleSubmit() {
    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }

    if (isEditing) {
      updateTask(projectId, task.id, {
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate,
      });
    } else {
      addTask(projectId, {
        title,
        description,
        priority,
        dueDate,
      });
    }

    onClose();
  }

  // Close when clicking the backdrop behind the modal.
  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
      >
        <div className="modal__header">
          <h2 className="modal__title" id="task-modal-title">
            {isEditing ? 'Edit Task' : 'New Task'}
          </h2>
          <button className="modal__close" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <div className="modal__body">
          {/* Title */}
          <div className="modal__field">
            <label className="modal__label" htmlFor="task-title">
              Title <span aria-hidden="true">*</span>
            </label>
            <input
              id="task-title"
              className="modal__input"
              type="text"
              placeholder="e.g. Design the landing page"
              value={title}
              onChange={e => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              autoFocus
            />
            {error && <p className="modal__error">{error}</p>}
          </div>

          {/* Description */}
          <div className="modal__field">
            <label className="modal__label" htmlFor="task-description">
              Description{' '}
              <span className="modal__optional">(optional)</span>
            </label>
            <textarea
              id="task-description"
              className="modal__input modal__textarea"
              placeholder="Any extra details about this task..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Priority */}
          <div className="modal__field">
            <label className="modal__label" htmlFor="task-priority">
              Priority
            </label>
            <select
              id="task-priority"
              className="modal__select"
              value={priority}
              onChange={e => setPriority(e.target.value)}
            >
              {PRIORITIES.map(p => (
                <option key={p} value={p}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Due Date */}
          <div className="modal__field">
            <label className="modal__label" htmlFor="task-due">
              Due Date{' '}
              <span className="modal__optional">(optional)</span>
            </label>
            <input
              id="task-due"
              className="modal__input"
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <div className="modal__footer">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>
            {isEditing ? 'Save Changes' : 'Add Task'}
          </Button>
        </div>
      </div>
    </div>
  );
}