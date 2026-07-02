// helpers.js
// Small, pure utility functions used across the app.
// Nothing here should import from other project files — no dependencies, no side effects.

// --- ID Generation ---

// Generates a unique ID by combining a random base-36 string with the current timestamp.
// Not cryptographically secure, but more than sufficient for localStorage-based IDs.
export function generateId() {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
}

// --- Date Formatting ---

// Formats an ISO date string (e.g. "2025-07-04") into a readable label like "Jul 4, 2025".
// Returns an empty string if no date is provided, so callers don't need to guard against it.
export function formatDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// Returns true if the given ISO date string is in the past (before today).
// Used to flag overdue tasks on cards and in the dashboard stats.
export function isOverdue(isoString) {
  if (!isoString) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0); // strip time so we compare dates only
  return new Date(isoString) < today;
}

// Returns true if the given ISO date string falls on today's date.
export function isDueToday(isoString) {
  if (!isoString) return false;
  const today = new Date().toISOString().slice(0, 10);
  return isoString.slice(0, 10) === today;
}

// --- Progress Calculation ---

// Calculates the percentage of tasks that are in the "done" column.
// Accepts an array of task objects, each expected to have a `status` field.
// Returns a whole number 0–100. Returns 0 if the task list is empty.
export function calcProgress(tasks) {
  if (!tasks || tasks.length === 0) return 0;
  const done = tasks.filter(t => t.status === 'done').length;
  return Math.round((done / tasks.length) * 100);
}

// --- Task Counting ---

// Returns the count of overdue tasks in an array.
// A task is overdue if it has a dueDate, is not already done, and the date has passed.
export function countOverdue(tasks) {
  if (!tasks || tasks.length === 0) return 0;
  return tasks.filter(t => t.status !== 'done' && isOverdue(t.dueDate)).length;
}