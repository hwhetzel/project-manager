// DashboardStats.jsx
// A stats bar rendered at the top of the board page.
// Pulls task counts, progress, and overdue info from the project's task list.
// Pure display — no state, no side effects, just derived numbers from props.

import { calcProgress, countOverdue } from '../../utils/helpers';
import './DashboardStats.css';

export default function DashboardStats({ tasks }) {
  const total      = tasks.length;
  const todo       = tasks.filter(t => t.status === 'todo').length;
  const inProgress = tasks.filter(t => t.status === 'inprogress').length;
  const done       = tasks.filter(t => t.status === 'done').length;
  const overdue    = countOverdue(tasks);
  const progress   = calcProgress(tasks);

  const stats = [
    {
      id: 'total',
      label: 'Total Tasks',
      value: total,
      accent: 'var(--color-text-muted)',
    },
    {
      id: 'todo',
      label: 'To Do',
      value: todo,
      accent: 'var(--color-text-muted)',
    },
    {
      id: 'inprogress',
      label: 'In Progress',
      value: inProgress,
      accent: 'var(--color-warning)',
    },
    {
      id: 'done',
      label: 'Done',
      value: done,
      accent: 'var(--color-success)',
    },
    {
      id: 'overdue',
      label: 'Overdue',
      value: overdue,
      accent: overdue > 0 ? 'var(--color-danger)' : 'var(--color-text-muted)',
    },
  ];

  return (
    <div className="dash">
      {/* Stat tiles */}
      <div className="dash__stats">
        {stats.map(stat => (
          <div key={stat.id} className="dash__stat">
            <span
              className="dash__stat-value"
              style={{ color: stat.accent }}
            >
              {stat.value}
            </span>
            <span className="dash__stat-label">{stat.label}</span>
          </div>
        ))}

        {/* Divider */}
        <div className="dash__divider" />

        {/* Progress — wider tile with its own bar */}
        <div className="dash__progress-tile">
          <div className="dash__progress-header">
            <span className="dash__stat-label">Progress</span>
            <span
              className="dash__stat-value"
              style={{ color: 'var(--color-primary)' }}
            >
              {progress}%
            </span>
          </div>
          <div className="dash__progress-bar">
            <div
              className="dash__progress-fill"
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
      </div>
    </div>
  );
}