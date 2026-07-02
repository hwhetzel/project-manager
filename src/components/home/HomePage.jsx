// HomePage.jsx
// The landing page. Renders all projects as a card grid.
// If no projects exist yet, shows an empty state with a prompt to create one.

import { useState } from 'react';
import { useProjectContext } from '../../context/ProjectContext';
import ProjectCard from './ProjectCard';
import NewProjectModal from '../modals/NewProjectModal';
import Button from '../shared/Button';
import './HomePage.css';

export default function HomePage() {
  const { projects } = useProjectContext();
  const [showModal, setShowModal] = useState(false);

  return (
    <main className="home">
      <div className="home__header">
        <div>
          <h1 className="home__title">My Projects</h1>
          <p className="home__subtitle">
            {projects.length === 0
              ? 'No projects yet — create one to get started'
              : `${projects.length} project${projects.length === 1 ? '' : 's'}`}
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>+ New Project</Button>
      </div>

      {projects.length === 0 ? (
        <div className="home__empty">
          <p className="home__empty-icon">📋</p>
          <p className="home__empty-text">Create your first project to get started</p>
          <Button onClick={() => setShowModal(true)}>+ New Project</Button>
        </div>
      ) : (
        <div className="home__grid">
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {showModal && (
        <NewProjectModal onClose={() => setShowModal(false)} />
      )}
    </main>
  );
}