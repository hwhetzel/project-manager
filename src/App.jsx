// App.jsx
// Root of the component tree. Two jobs:
// 1. Wrap everything in ProjectContext so all routes share the same state.
// 2. Define the two routes: home page and board page.

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProjectContext } from './context/ProjectContext';
import { useProjects } from './hooks/useProjects';
import Navbar from './components/shared/Navbar';
import HomePage from './components/home/HomePage';
import BoardPage from './components/board/BoardPage';

function ProjectProvider({ children }) {
  const projectState = useProjects();

  return (
    <ProjectContext.Provider value={projectState}>
      {children}
    </ProjectContext.Provider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ProjectProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/board/:projectId" element={<BoardPage />} />
        </Routes>
      </ProjectProvider>
    </BrowserRouter>
  );
}