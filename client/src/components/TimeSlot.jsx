import { useDroppable } from '@dnd-kit/core';
import { AppointmentCard } from './AppointmentCard.jsx';

export function TimeSlot({ time, appointments }) {
  const { setNodeRef, isOver } = useDroppable({ id: time });
  return (
    <div ref={setNodeRef} className={`time-slot ${isOver ? 'is-over' : ''}`}>
      <div className="time-slot-label">{time}</div>
      <div className="time-slot-cards">
        {appointments.map((appt) => (
          <AppointmentCard key={appt.id} appointment={appt} />
        ))}
      </div>
    </div>
  );
}
