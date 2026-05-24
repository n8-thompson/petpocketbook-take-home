import { useDraggable } from '@dnd-kit/core';

export function AppointmentCard({ appointment, overlay = false }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: appointment.id,
    data: { appointment },
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  const className = [
    'appointment-card',
    isDragging ? 'is-dragging' : '',
    overlay ? 'is-overlay' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={setNodeRef} style={style} className={className} {...listeners} {...attributes}>
      <img
        src={`/images/${appointment.pet.type}.svg`}
        alt={appointment.pet.type}
        className="appointment-avatar"
      />
      <span className="appointment-name">{appointment.pet.name}</span>
    </div>
  );
}
