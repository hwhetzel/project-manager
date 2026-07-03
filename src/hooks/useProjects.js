// useProjects.js
// The main state hook for the app. Manages all projects and their tasks in memory,
// keeps localStorage in sync on every change, and exposes clean action functions
// so components never manipulate state directly.

import { useState, useCallback } from 'react';
import { getProjects, saveProjects } from '../services/storageService';
import { generateId } from '../utils/helpers';

export function useProjects() {
  // Seed state from localStorage on first render.
  // useState accepts an initializer function so this only runs once.
  const [projects, setProjects] = useState(() => getProjects());

  // Internal helper — updates state and persists to localStorage in one step.
  // Every action below goes through this so storage never gets out of sync.
  const persist = useCallback((updatedProjects) => {
    setProjects(updatedProjects);
    saveProjects(updatedProjects);
  }, []);

  // --- Project Actions ---

  // Creates a new project and adds it to the list.
  // `name` is required; `description` is optional.
  const createProject = useCallback((name, description = '') => {
    const newProject = {
      id: generateId(),
      name: name.trim(),
      description: description.trim(),
      createdAt: new Date().toISOString(),
      tasks: [],
    };
    persist([...projects, newProject]);
    return newProject;
  }, [projects, persist]);

  // Updates the name and/or description of an existing project.
  const updateProject = useCallback((projectId, updates) => {
    const updated = projects.map(p =>
      p.id === projectId ? { ...p, ...updates } : p
    );
    persist(updated);
  }, [projects, persist]);

  // Permanently deletes a project and all its tasks.
  const deleteProject = useCallback((projectId) => {
    persist(projects.filter(p => p.id !== projectId));
  }, [projects, persist]);

  // --- Task Actions ---

  // Adds a new task to the specified project.
  // Tasks start in the "todo" column by default.
  const addTask = useCallback((projectId, taskData) => {
    const newTask = {
      id: generateId(),
      title: taskData.title.trim(),
      description: taskData.description?.trim() || '',
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || '',
      status: 'todo',
      createdAt: new Date().toISOString(),
    };
    const updated = projects.map(p =>
      p.id === projectId
        ? { ...p, tasks: [...p.tasks, newTask] }
        : p
    );
    persist(updated);
  }, [projects, persist]);

  // Updates any fields on an existing task.
  const updateTask = useCallback((projectId, taskId, updates) => {
    const updated = projects.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        tasks: p.tasks.map(t =>
          t.id === taskId ? { ...t, ...updates } : t
        ),
      };
    });
    persist(updated);
  }, [projects, persist]);

  // Removes a task from a project permanently.
  const deleteTask = useCallback((projectId, taskId) => {
    const updated = projects.map(p => {
      if (p.id !== projectId) return p;
      return { ...p, tasks: p.tasks.filter(t => t.id !== taskId) };
    });
    persist(updated);
  }, [projects, persist]);

  // Moves a task to a new status column and reorders it within that column.
  // Called by the drag-and-drop handler in BoardPage.
  // Preserves the relative order of all other tasks in all columns.
  const moveTask = useCallback((projectId, taskId, newStatus, newIndex) => {
    const updated = projects.map(p => {
      if (p.id !== projectId) return p;

      // Separate the moving task from the rest.
      const task = p.tasks.find(t => t.id === taskId);
      const withoutTask = p.tasks.filter(t => t.id !== taskId);

      // Update the task's status to match its destination column.
      const movedTask = { ...task, status: newStatus };

      // Split remaining tasks into destination column and everything else.
      // We maintain their original relative order within each group.
      const destTasks = withoutTask.filter(t => t.status === newStatus);
      const otherTasks = withoutTask.filter(t => t.status !== newStatus);

      // Insert the moved task at the correct position in the destination column.
      destTasks.splice(newIndex, 0, movedTask);

      // Rebuild the flat array: non-destination tasks first, then destination tasks.
      // Column render order (todo → inprogress → done) is determined by the
      // Column component filtering by status, not by array order, so this is safe.
      return { ...p, tasks: [...otherTasks, ...destTasks] };
    });
    persist(updated);
  }, [projects, persist]);

  // Looks up a single project by ID. Returns undefined if not found.
  const getProjectById = useCallback((projectId) => {
    return projects.find(p => p.id === projectId);
  }, [projects]);

  return {
    projects,
    createProject,
    updateProject,
    deleteProject,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    getProjectById,
  };
}