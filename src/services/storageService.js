// storageService.js
// All localStorage reads and writes go through this file.
// No component should ever call localStorage directly — centralizing it here
// means if we ever swap storage (e.g. to IndexedDB or an API), only this file changes.

const STORAGE_KEY = 'project_manager_data';

// Returns the full projects array from localStorage.
// If nothing is stored yet, returns an empty array so callers never get null.
export function getProjects() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    // If parsing fails (corrupted data), wipe and start fresh rather than crashing.
    console.error('Failed to parse stored projects:', err);
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

// Saves the full projects array to localStorage, overwriting whatever was there.
// Always pass the complete array — this is not an append operation.
export function saveProjects(projects) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (err) {
    // This can happen if localStorage is full (rare but possible on mobile).
    console.error('Failed to save projects to localStorage:', err);
  }
}

// Wipes all app data from localStorage. Used for a hard reset if needed.
// Not exposed in the UI yet, but available for debugging and future use.
export function clearProjects() {
  localStorage.removeItem(STORAGE_KEY);
}