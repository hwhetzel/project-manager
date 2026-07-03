// Temporary placeholder — replaced in Phase 10
export default function NewTaskModal({ onClose }) {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 200
    }}>
      <div style={{ background: 'var(--color-surface)', padding: '2rem', borderRadius: '0.5rem' }}>
        <p>NewTaskModal coming in Phase 10</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}