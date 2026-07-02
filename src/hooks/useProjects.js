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
    return newProject; // return so the caller can navigate to it immediately
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
      priority: taskData.priority || 'medium', // 'low' | 'medium' | 'high'
      dueDate: taskData.dueDate || '',
      status: 'todo', // 'todo' | 'inprogress' | 'done'
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

  // Moves a task to a new status column and optionally reorders it within that column.
  // Called by the drag-and-drop handler in BoardPage.
  // `newStatus` is the destination column: 'todo' | 'inprogress' | 'done'
  // `newIndex` is where in that column's list the task should land.
  const moveTask = useCallback((projectId, taskId, newStatus, newIndex) => {
    const updated = projects.map(p => {
      if (p.id !== projectId) return p;

      // Pull the task out of its current position
      const task = p.tasks.find(t => t.id === taskId);
      const remaining = p.tasks.filter(t => t.id !== taskId);

      // Update the task's status to match its new column
      const movedTask = { ...task, status: newStatus };

      // Figure out where to insert it among the tasks that belong to the destination column.
      // We need to find the correct absolute index in the flat tasks array.
      const destinationTasks = remaining.filter(t => t.status === newStatus);
      const otherTasks = remaining.filter(t => t.status !== newStatus);

      // Insert the moved task at the right position within the destination column's tasks
      destinationTasks.splice(newIndex, 0, movedTask);

      // Rebuild the flat tasks array: other columns' tasks + reordered destination tasks.
      // We preserve the relative order of non-destination tasks.
      const reordered = [];
      let destPointer = 0;

      // Walk the remaining tasks and weave destination tasks back in at the right spots
      for (const t of [...otherTasks]) {
        reordered.push(t);
      }

      return { ...p, tasks: [...reordered, ...destinationTasks] };
    });
    persist(updated);
  }, [projects, persist]);

  // Looks up a single project by ID. Returns undefined if not found.
  // Used by BoardPage to get the current project from the URL param.
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