// Sidebar.jsx
// Project list panel shown on the board page.
// Highlights the active project and lets users jump between boards
// without going back to the home page.

import { useNavigate, useParams } from 'react-router-dom';
import { useProjectContext } from '../../context/ProjectContext';
import { calcProgress } from '../../utils/helpers';
import './Sidebar.css';

export default function Sidebar() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { projects } = useProjectContext();

  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <span className="sidebar__heading">Projects</span>
        <span className="sidebar__count">{projects.length}</span>
      </div>

      {projects.length === 0 ? (
        <p className="sidebar__empty">No projects yet.</p>
      ) : (
        <ul className="sidebar__list">
          {projects.map(project => {
            const isActive = project.id === projectId;
            const progress = calcProgress(project.tasks);

            return (
              <li key={project.id}>
                <button
                  className={`sidebar__item ${isActive ? 'sidebar__item--active' : ''}`}
                  onClick={() => navigate(`/board/${project.id}`)}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div className="sidebar__item-header">
                    {/* Active indicator dot */}
                    <span className={`sidebar__dot ${isActive ? 'sidebar__dot--active' : ''}`} />
                    <span className="sidebar__item-name truncate">{project.name}</span>
                  </div>

                  {/* Mini progress bar per project */}
                  <div className="sidebar__progress">
                    <div className="sidebar__progress-bar">
                      <div
                        className="sidebar__progress-fill"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="sidebar__progress-label">{progress}%</span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}