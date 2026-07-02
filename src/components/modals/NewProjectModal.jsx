// NewProjectModal.jsx
// Modal form for creating a new project.
// Fields: name (required), description (optional).
// On submit, calls createProject from context then closes.

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectContext } from '../../context/ProjectContext';
import Button from '../shared/Button';
import './Modal.css';

export default function NewProjectModal({ onClose }) {
  const { createProject } = useProjectContext();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  function handleSubmit() {
    if (!name.trim()) {
      setError('Project name is required.');
      return;
    }
    const newProject = createProject(name, description);
    onClose();
    navigate(`/board/${newProject.id}`);
  }

  // Close the modal when clicking the backdrop behind it.
  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="new-project-title">
        <div className="modal__header">
          <h2 className="modal__title" id="new-project-title">New Project</h2>
          <button className="modal__close" onClick={onClose} aria-label="Close modal">✕</button>
        </div>

        <div className="modal__body">
          <div className="modal__field">
            <label className="modal__label" htmlFor="project-name">
              Project Name <span aria-hidden="true">*</span>
            </label>
            <input
              id="project-name"
              className="modal__input"
              type="text"
              placeholder="e.g. Website Redesign"
              value={name}
              onChange={e => {
                setName(e.target.value);
                if (error) setError('');
              }}
              autoFocus
            />
            {error && <p className="modal__error">{error}</p>}
          </div>

          <div className="modal__field">
            <label className="modal__label" htmlFor="project-description">
              Description <span className="modal__optional">(optional)</span>
            </label>
            <textarea
              id="project-description"
              className="modal__input modal__textarea"
              placeholder="What is this project about?"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <div className="modal__footer">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Create Project</Button>
        </div>
      </div>
    </div>
  );
}