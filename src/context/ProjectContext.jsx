// ProjectContext.jsx
// Creates the global React context that holds all project and task data.
// This file only defines and provides the context — the actual state logic
// lives in useProjects.js so it stays clean and testable.

import { createContext, useContext } from 'react';

// The context object itself. Components import this to consume state.
export const ProjectContext = createContext(null);

// Convenience hook — lets components do `useProjectContext()` instead of
// having to import both useContext and ProjectContext every time.
export function useProjectContext() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjectContext must be used inside a ProjectProvider');
  }
  return context;
}