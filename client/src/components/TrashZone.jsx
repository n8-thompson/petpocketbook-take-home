import { useDroppable } from '@dnd-kit/core';

export function TrashZone() {
  const { setNodeRef, isOver } = useDroppable({ id: 'trash' });
  return (
    <div ref={setNodeRef} className={`trash-zone ${isOver ? 'is-over' : ''}`} aria-label="Drop to delete">
      <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 6h18" />
        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
      </svg>
      <span className="trash-zone-label">Drop to delete</span>
    </div>
  );
}
