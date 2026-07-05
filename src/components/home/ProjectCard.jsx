// ProjectCard.jsx
// A single project card on the home page.
// Shows name, description, task count, progress bar, and overdue count.
// Clicking the card navigates to that project's Kanban board.

import { useNavigate } from 'react-router-dom';
import { useProjectContext } from '../../context/ProjectContext';
import { calcProgress, countOverdue } from '../../utils/helpers';
import './ProjectCard.css';

export default function ProjectCard({ project }) {
  const navigate = useNavigate();
  const { deleteProject } = useProjectContext();
  const progress = calcProgress(project.tasks);
  const overdueCount = countOverdue(project.tasks);
  const taskCount = project.tasks.length;
  const doneCount = project.tasks.filter(t => t.status === 'done').length;
  const isComplete = taskCount > 0 && progress === 100;

  function handleDelete(e) {
    // Stop the click from bubbling up to the card and triggering navigation.
    e.stopPropagation();
    if (confirm(`Delete "${project.name}"? This cannot be undone.`)) {
      deleteProject(project.id);
    }
  }

  return (
    <article
      className="project-card"
      onClick={() => navigate(`/board/${project.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && navigate(`/board/${project.id}`)}
      aria-label={`Open project: ${project.name}`}
    >
      <div className="project-card__header">
        <h2 className="project-card__name truncate">{project.name}</h2>
        <button
          className="project-card__delete"
          onClick={handleDelete}
          aria-label={`Delete project: ${project.name}`}
        >
          ✕
        </button>
      </div>

      {project.description && (
        <p className="project-card__description">{project.description}</p>
      )}

      <div className="project-card__stats">
        <span>{taskCount} task{taskCount !== 1 ? 's' : ''}</span>
        <span>{doneCount} done</span>
        {overdueCount > 0 && (
          <span className="project-card__overdue">
            {overdueCount} overdue
          </span>
        )}
      </div>

      <div className="project-card__progress">
        <div className="project-card__progress-bar">
          <div
            className={`project-card__progress-fill ${isComplete ? 'project-card__progress-fill--complete' : ''}`}
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
        <span className="project-card__progress-label">{progress}%</span>
      </div>
    </article>
  );
}